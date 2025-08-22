"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getCachedUserProfile, getCurrentAccessToken } from "@/services/auth/auth.service"
import { getTodosByUserId } from "@/services/todos/todos.service"
import { toast } from "sonner"
import ProfileView from "./view"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [todos, setTodos] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  const loadUserData = useCallback(async () => {
    setLoading(true)
    try {
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

      const userTodos = await getTodosByUserId(currentUser.id)
      setTodos(userTodos)

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const completed = userTodos.filter((todo) => todo.completed).length
      
      const pending = userTodos.filter((todo) => {
        if (todo.completed) return false;
        if (!todo.dueDate) return true;
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= now;
      }).length;

      const overdue = userTodos.filter((todo) => {
        if (todo.completed) return false;
        if (!todo.dueDate) return false;
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < now;
      }).length;

      setStats({
        total: userTodos.length,
        completed,
        pending,
        overdue,
        completionRate: userTodos.length > 0 ? Math.round((completed / userTodos.length) * 100) : 0,
      })
    } catch (err) {
      console.error("Error loading profile:", err)
      if (err.response?.status === 401) {
        router.push("/login")
      } else {
        toast.error("Failed to load profile data. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  const joinDate = user
    ? user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A"
    : "N/A"

  return <ProfileView user={user} todos={todos} stats={stats} loading={loading} joinDate={joinDate} />
}
