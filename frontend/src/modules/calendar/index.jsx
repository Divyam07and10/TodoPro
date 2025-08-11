"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getCachedUserProfile, getCurrentAccessToken, refreshAccessToken } from "@/services/auth/auth.service"
import { getTodosByUserId } from "@/services/todos/todos.service"
import { createTodo, updateTodo } from "@/services/actions/todo.actions"
import { toast } from "sonner"
import CalendarView from "./view"

export default function CalendarModule() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [todos, setTodos] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState(null)

  const loadTodos = useCallback(async (userId) => {
    setLoading(true)
    try {
      const userTodos = await getTodosByUserId(userId)
      setTodos(userTodos)
    } catch (err) {
      toast.error("Failed to load todos. Please try again.")
      console.error("Error loading todos:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const checkUserAndLoadTodos = async () => {
      const currentUser = getCachedUserProfile()
      if (currentUser) {
        setUser(currentUser)
        await loadTodos(currentUser.id)
      } else {
        try {
          const fetchedUser = await getCurrentUser()
          if (fetchedUser) {
            setUser(fetchedUser)
            await loadTodos(fetchedUser.id)
          } else {
            router.push("/login")
          }
        } catch (error) {
          console.error("Authentication error:", error)
          router.push("/login")
        }
      }
    }
    checkUserAndLoadTodos()
  }, [router, loadTodos])

  const handleServerActionWithRefresh = useCallback(
    async (serverAction, ...args) => {
      const accessToken = getCurrentAccessToken()

      if (!accessToken) {
        toast.error("Authentication required. Please log in again.")
        return { success: false, error: "Authentication required. Please log in again." }
      }

      let result = await serverAction(...args, accessToken)

      if (!result.success && result.needsRefresh) {
        try {
          console.log("[handleServerActionWithRefresh] Attempting token refresh...")
          const newAccessToken = await refreshAccessToken()
          result = await serverAction(...args, newAccessToken)
          if (result.success) {
            toast.success("Session refreshed and action completed.")
          }
        } catch (refreshError) {
          console.error("[handleServerActionWithRefresh] Token refresh failed:", refreshError)
          toast.error("Session expired. Please log in again.")
          router.push("/login")
          return { success: false, error: "Session expired. Please log in again." }
        }
      }

      if (!result.success && result.error) {
        toast.error("Action Failed", { description: result.error })
      }

      return result
    },
    [router],
  )

  const handleCreateTodo = useCallback(
    async (todoData) => {
      try {
        const { userId, completed, ...cleanTodoData } = todoData
        const result = await handleServerActionWithRefresh(createTodo, cleanTodoData)
        if (result.success) {
          if (!result.data) {
            console.warn("[handleCreateTodo] No todo returned in result, adding to state with fallback.")
            setTodos((prevTodos) => [...prevTodos, { ...cleanTodoData, id: result.id || Date.now() }])
            toast.success("Todo Created!", { description: "Task has been added." })
          } else {
            setTodos((prevTodos) => [...prevTodos, result.data])
            toast.success("Todo Created!", { description: `${result.data.title ?? "Task"} has been added.` })
          }
        }
        return result
      } catch (err) {
        toast.error("An unexpected error occurred. Please try again.")
        console.error("Error creating todo:", err)
        return { success: false, error: "An unexpected error occurred." }
      }
    },
    [handleServerActionWithRefresh],
  )

  const handleUpdateTodo = useCallback(
    async (id, updates) => {
      try {
        const result = await handleServerActionWithRefresh(updateTodo, id, updates)
        if (result.success) {
          toast.success("Todo updated!", { description: `${result.data.title ?? "Task"} has been updated.` })
          setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? result.data : todo)))
          setShowEditDialog(false)
          setEditingTodoId(null)
        }
        return result
      } catch (err) {
        toast.error("An unexpected error occurred. Please try again.")
        console.error("Error updating todo:", err)
        return { success: false, error: "An unexpected error occurred." }
      }
    },
    [handleServerActionWithRefresh],
  )

  const handleToggleTodo = useCallback(
    async (id) => {
      const todoToToggle = todos.find((t) => t.id === id)
      if (!todoToToggle) {
        toast.error("Todo not found.")
        return { success: false, error: "Todo not found" }
      }

      const originalCompletedStatus = todoToToggle.completed
      const newCompletedStatus = !originalCompletedStatus

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: newCompletedStatus } : todo)),
      )

      try {
        const result = await handleServerActionWithRefresh(updateTodo, id, { completed: newCompletedStatus })

        if (!result.success) {
          setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: originalCompletedStatus } : todo)),
          )
        } else {
          toast.success(newCompletedStatus ? "Todo Completed!" : "Todo Marked as Pending!", {
            description: `${todoToToggle.title ?? "Task"} status has been updated.`,
          })
        }
        return result
      } catch (error) {
        console.error("Error in handleToggleTodo:", error)
        toast.error("Failed to toggle todo status. Please try again.")
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: originalCompletedStatus } : todo)),
        )
        return { success: false, error: "Failed to toggle todo status. Please try again." }
      }
    },
    [todos, handleServerActionWithRefresh],
  )

  const handleEditTodo = useCallback((todo) => {
    setEditingTodoId(todo.id)
    setShowEditDialog(true)
  }, [])

  const handleCloseEditDialog = useCallback(() => {
    setShowEditDialog(false)
    setEditingTodoId(null)
  }, [])

  const generateCalendar = useCallback(
    (date) => {
      const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      const calendarDays = []

      for (let i = 0; i < startDay; i++) {
        calendarDays.push({ date: null, isCurrentMonth: false, todos: [] })
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(date.getFullYear(), date.getMonth(), i)
        const todosForDay = todos.filter(
          (todo) => !todo.completed && todo.dueDate && !isNaN(new Date(todo.dueDate).getTime()) && new Date(todo.dueDate).toDateString() === day.toDateString(),
        )

        calendarDays.push({
          date: day,
          isCurrentMonth: true,
          isToday: day.toDateString() === new Date().toDateString(),
          isSelected: selectedDate && day.toDateString() === selectedDate.toDateString(),
          todos: todosForDay,
        })
      }

      return calendarDays
    },
    [todos, selectedDate],
  )

  const calendarDays = useMemo(() => generateCalendar(currentDate), [generateCalendar, currentDate])

  const todosForSelectedDate = useMemo(
    () =>
      selectedDate
        ? todos.filter((todo) => todo.dueDate && !isNaN(new Date(todo.dueDate).getTime()) && new Date(todo.dueDate).toDateString() === selectedDate.toDateString())
        : [],
    [todos, selectedDate],
  )

  const editingTodo = useMemo(
    () => (editingTodoId ? todos.find((todo) => todo.id === editingTodoId) : null),
    [editingTodoId, todos],
  )

  if (!user) {
    return null
  }

  return (
    <CalendarView
      user={user}
      todos={todos}
      currentDate={currentDate}
      selectedDate={selectedDate}
      calendarDays={calendarDays}
      todosForSelectedDate={todosForSelectedDate}
      handleCreateTodo={handleCreateTodo}
      handleUpdateTodo={handleUpdateTodo}
      handleToggleTodo={handleToggleTodo}
      handleEditTodo={handleEditTodo}
      handleCloseEditDialog={handleCloseEditDialog}
      showEditDialog={showEditDialog}
      editingTodo={editingTodo}
      setCurrentDate={setCurrentDate}
      setSelectedDate={setSelectedDate}
    />
  )
}