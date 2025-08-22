"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getCachedUserProfile, setAccessToken, getCurrentAccessToken, refreshAccessToken } from "@/services/auth/auth.service"
import { getTodosByUserId } from "@/services/todos/todos.service"
import { createTodo, updateTodo, deleteTodo } from "@/services/actions/todo.actions"
import { categories } from "@/lib/constants"
import { toast } from "sonner"
import DashboardView from "./view"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    orderBy: "date-latest",
  })

  const loadTodos = useCallback(async (userId, currentFilters) => {
    setLoading(true)
    try {
      const userTodos = await getTodosByUserId(userId, currentFilters)
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
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const accessTokenFromUrl = urlParams.get("access_token")
        const authError = urlParams.get("error")

        if (authError) {
          toast.error("Authentication failed. Please try again.")
          router.replace("/login")
          setLoading(false)
          return
        }

        if (accessTokenFromUrl) {
          setAccessToken(accessTokenFromUrl)
          router.replace("/dashboard", undefined, { shallow: true })
        }

        const currentToken = getCurrentAccessToken()
        if (!currentToken) {
          router.push("/login")
          return
        }

        let currentUser = getCachedUserProfile()
        if (currentUser) {
          setUser(currentUser)
        }

        currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }

        setUser(currentUser)
        await loadTodos(currentUser.id, filters)
      } catch (error) {
        toast.error("Authentication error. Please try logging in again.")
        router.push("/login")
      }
    }

    checkUserAndLoadTodos()
  }, [router, loadTodos, filters])

  useEffect(() => {
    if (user) {
      loadTodos(user.id, filters);
    }
  }, [filters, user, loadTodos]);


  const editingTodo = useMemo(() => {
    return editingTodoId ? todos.find((todo) => todo.id === editingTodoId) : null
  }, [editingTodoId, todos])

  const handleServerActionWithRefresh = async (serverAction, ...args) => {
    const accessToken = getCurrentAccessToken()

    if (!accessToken) {
      toast.error("Authentication required. Please log in again.")
      return { success: false, error: "Authentication required. Please log in again." }
    }

    let result = await serverAction(...args, accessToken)

    if (!result.success && result.needsRefresh) {
      try {
        const newAccessToken = await refreshAccessToken()
        result = await serverAction(...args, newAccessToken)
        if (result.success) {
          toast.success("Session refreshed and action completed.")
        }
      } catch (refreshError) {
        toast.error("Session expired. Please log in again.")
        router.push("/login")
        return { success: false, error: "Session expired. Please log in again." }
      }
    }

    if (!result.success && result.error) {
      toast.error("Action Failed", { description: result.error })
    }

    return result
  }

  const handleCreateTodo = useCallback(
    async (todoData) => {
      try {
        const { userId, completed, ...cleanTodoData } = todoData
        const result = await handleServerActionWithRefresh(createTodo, cleanTodoData)

        if (result.success) {
          toast.success("Todo Created!", { description: `${result.data?.title ?? "Task"} has been added.` })
          if (user) {
            await loadTodos(user.id, filters);
          }
        }
        return result
      } catch (error) {
        const errorResult = { success: false, error: "Failed to create todo. Please try again." }
        toast.error(errorResult.error)
        return errorResult
      }
    },
    [router, loadTodos, user, filters]
  )

  const handleUpdateTodo = useCallback(
    async (id, updates) => {
      try {
        const result = await handleServerActionWithRefresh(updateTodo, id, updates)

        if (result.success) {
          toast.success("Todo Updated!", { description: `${result.data?.title ?? "Task"} has been updated.` })
          setShowEditDialog(false)
          setEditingTodoId(null)
          if (user) {
            await loadTodos(user.id, filters);
          }
        }
        return result
      } catch (error) {
        toast.error("Failed to update todo. Please try again.")
        return { success: false, error: "Failed to update todo. Please try again." }
      }
    },
    [router, loadTodos, user, filters]
  )

  const handleDeleteTodo = useCallback(
    async (id) => {
      try {
        const result = await handleServerActionWithRefresh(deleteTodo, id)

        if (result.success) {
          toast.success("Todo Deleted!", { description: "The todo has been permanently removed." })
          if (user) {
            await loadTodos(user.id, filters);
          }
        }
        return result
      } catch (error) {
        toast.error("Failed to delete todo. Please try again.")
        return { success: false, error: "Failed to delete todo. Please try again." }
      }
    },
    [router, loadTodos, user, filters]
  )

  const handleToggleTodo = useCallback(
    async (id) => {
      const todoToToggle = todos.find((t) => t.id === id)
      if (!todoToToggle) {
        toast.error("Todo not found.")
        return { success: false, error: "Todo not found" }
      }

      const newCompletedStatus = !todoToToggle.completed

      try {
        const result = await handleServerActionWithRefresh(updateTodo, id, { completed: newCompletedStatus })

        if (result.success) {
          toast.success(newCompletedStatus ? "Todo Completed!" : "Todo Marked as Pending!", {
            description: `${todoToToggle.title ?? "Task"} status has been updated.`,
          })
          if (user) {
            await loadTodos(user.id, filters);
          }
        }
        return result
      } catch (error) {
        toast.error("Failed to toggle todo status. Please try again.")
        return { success: false, error: "Failed to toggle todo status. Please try again." }
      }
    },
    [todos, router, loadTodos, user, filters]
  )

  const handleEditTodo = useCallback((todo) => {
    setEditingTodoId(todo.id)
    setShowEditDialog(true)
  }, [])

  const handleCloseEditDialog = useCallback(() => {
    setShowEditDialog(false)
    setEditingTodoId(null)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      orderBy: "date-latest",
    })
    toast.info("Filters Reset", { description: "All filters have been cleared." })
  }, [])

  const sortedCategories = useMemo(() => {
    const categoryData = categories.map((category) => {
      const todosInThisCategory = todos.filter((todo) => todo.category === category.value)

      let representativeDate = null
      if (todosInThisCategory.length > 0) {
        if (filters.orderBy === "date-latest") {
          representativeDate = todosInThisCategory.reduce((maxDate, todo) => {
            if (!todo.createdAt) return maxDate
            const currentCreatedAt = new Date(todo.createdAt)
            return maxDate === null || currentCreatedAt > maxDate ? currentCreatedAt : maxDate
          }, null)
        } else if (filters.orderBy === "date-oldest") {
          representativeDate = todosInThisCategory.reduce((minDate, todo) => {
            if (!todo.createdAt) return minDate
            const currentCreatedAt = new Date(todo.createdAt)
            return minDate === null || currentCreatedAt < minDate ? currentCreatedAt : minDate
          }, null)
        }
      }

      return {
        ...category,
        todos: todosInThisCategory,
        representativeDate: representativeDate,
      }
    })

    return categoryData.sort((a, b) => {
      if (!a.representativeDate && !b.representativeDate) return 0
      if (!a.representativeDate) return 1
      if (!b.representativeDate) return -1
      if (filters.orderBy === "date-latest") {
        return b.representativeDate.getTime() - a.representativeDate.getTime()
      } else if (filters.orderBy === "date-oldest") {
        return a.representativeDate.getTime() - b.representativeDate.getTime()
      }
      return 0
    })
  }, [todos, filters.orderBy])

  const stats = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => {
        if (t.completed) return false;
        if (!t.dueDate) return true;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= now;
      }).length,
      overdue: todos.filter((t) => {
        if (t.completed) return false;
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < now;
      }).length,
    };
  }, [todos]);

  return (
    <DashboardView
      user={user}
      stats={stats}
      loading={loading}
      sortedCategories={sortedCategories}
      filters={filters}
      showEditDialog={showEditDialog}
      editingTodo={editingTodo}
      handleCreateTodo={handleCreateTodo}
      handleUpdateTodo={handleUpdateTodo}
      handleDeleteTodo={handleDeleteTodo}
      handleToggleTodo={handleToggleTodo}
      handleEditTodo={handleEditTodo}
      handleCloseEditDialog={handleCloseEditDialog}
      handleResetFilters={handleResetFilters}
      setFilters={setFilters}
    />
  )
}
