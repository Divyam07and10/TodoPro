"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar } from "lucide-react"
import { categories, priorities } from "@/lib/constants"
import { useState } from "react"

export default function TodoCard({ todo, onUpdate, onDelete, onToggle, onEdit }) {
  const category = categories.find((c) => c.value === todo.category)
  const priority = priorities.find((p) => p.value === todo.priority)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Calculate if the todo is overdue based on the beginning of the current day
  const isOverdue = (() => {
    if (!todo.dueDate || todo.completed) {
      return false; // Not overdue if no due date or already completed
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the beginning of the day

    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0); // Normalize due date to the beginning of its day

    return dueDate < today; // Overdue if due date is strictly before today's beginning
  })();

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await onDelete(todo.id)
      if (!result.success) {
        console.error("Failed to delete todo:", result.error)
      }
    } catch (error) {
      console.error("Unexpected error during delete:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      const result = await onToggle(todo.id)
      if (!result.success) {
        console.error("Failed to toggle todo status:", result.error)
      }
    } catch (error) {
      console.error("Unexpected error during toggle:", error)
    } finally {
      setIsToggling(false)
    }
  }

  const handleEdit = () => {
    onEdit(todo)
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
        <div className="flex items-center space-x-3">
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={handleToggle}
            disabled={isToggling}
            className="h-5 w-5"
          />
          <label
            htmlFor={`todo-${todo.id}`}
            className={`text-lg font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
              todo.completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {todo.title}
          </label>
        </div>

        <div className="flex space-x-1 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={priority?.color}>
              {priority?.label}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <div className={`w-2 h-2 rounded-full ${category?.color} mr-1`} />
              {category?.label}
            </Badge>
          </div>

          {todo.dueDate && (
            <div className={`flex items-center text-xs ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(todo.dueDate)}
            </div>
          )}
        </div>
        {todo.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{todo.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
