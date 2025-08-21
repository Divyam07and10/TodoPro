"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, CheckCircle2, XCircle } from "lucide-react"
import { categories, priorities } from "@/lib/constants"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"

export default function TodoForm({ onSubmit, todo = null, trigger = null, onToggle = null, open = undefined, onOpenChange = undefined }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined && onOpenChange !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen

  const [formData, setFormData] = useState(() => ({
    title: todo?.title || "",
    description: todo?.description || "",
    priority: todo?.priority || "medium",
    category: todo?.category || "personal",
    dueDate: todo?.dueDate ? todo.dueDate.split("T")[0] : "",
  }))

  const [submitting, setSubmitting] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [error, setError] = useState("")

  // Log todo object when in edit mode to debug createdAt
  useEffect(() => {
    if (todo) {
      console.log("[TodoForm] Todo object:", { id: todo.id, createdAt: todo.createdAt })
    }
  }, [todo])

  useEffect(() => {
    if (!dialogOpen) {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "personal",
        dueDate: "",
      })
      setError("")
      setSubmitting(false)
      setToggling(false)
    }
  }, [dialogOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    // Validate all required fields for creating a new todo
    if (!todo && (!formData.title.trim() || !formData.description.trim() || !formData.dueDate)) {
      toast.error("Title, description, and due date are required to create a new todo.")
      setSubmitting(false)
      return
    }

    // Validate only title for editing an existing todo
    if (todo && !formData.title.trim()) {
      setError("Title is required")
      setSubmitting(false)
      return
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate || null,
      }

      const result = todo ? await onSubmit(todo.id, payload) : await onSubmit(payload)

      if (result?.success) {
        setDialogOpen(false)
      } else {
        setError(result?.error || "Failed to save todo.")
      }
    } catch (err) {
      setError("Unexpected error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async () => {
    if (!onToggle || !todo) return
    setToggling(true)
    setError("")
    try {
      const result = await onToggle(todo.id)
      if (result?.success) setDialogOpen(false)
      else setError(result?.error || "Failed to update status.")
    } catch (err) {
      setError("Unexpected error while toggling.")
    } finally {
      setToggling(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not available"
    try {
      return format(parseISO(dateString), "MMM d, yyyy, h:mm a")
    } catch {
      return "Invalid date"
    }
  }

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Todo
    </Button>
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isControlled && <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{todo ? "Edit Todo" : "Add New Todo"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required maxLength={500} />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={formData.priority} onValueChange={(v) => handleSelectChange("priority", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className={p.color}>{p.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(v) => handleSelectChange("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${c.color} mr-2`} />
                      {c.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
          </div>

          {todo && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input
                id="createdAt"
                value={formatDate(todo.createdAt)}
                disabled
                className="bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            {todo && onToggle && (
              <Button
                type="button"
                variant="outline"
                onClick={handleToggle}
                disabled={submitting || toggling}
                className={
                  todo.completed
                    ? "text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                    : "text-green-600 border-green-600 hover:bg-green-50"
                }
              >
                {toggling ? (
                  <div className="animate-spin h-4 w-4 border-b-2 border-current rounded-full mr-2"></div>
                ) : todo.completed ? (
                  <XCircle className="h-4 w-4 mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                {toggling ? "Updating..." : todo.completed ? "Mark as Pending" : "Mark as Complete"}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting || toggling}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || toggling}>
              {submitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                  {todo ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{todo ? "Update" : "Create"} Todo</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
