"use client"

import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Edit } from "lucide-react"
import TodoForm from "@/components/todo/todo-form"

/**
 * Renders the visual representation of the calendar and associated todo lists.
 * This is a presentational component that receives all data and callbacks via props.
 * @param {Object} props - The component props.
 * @param {Object} props.user - The current user object.
 * @param {Array} props.todos - All todos for the user.
 * @param {Date} props.currentDate - The date representing the current month being displayed.
 * @param {Date} props.selectedDate - The date currently selected on the calendar.
 * @param {Array} props.calendarDays - Array of objects representing each day in the calendar grid.
 * @param {Array} props.todosForSelectedDate - Todos filtered for the selected date.
 * @param {(todoData: Object) => Promise<Object>} props.handleCreateTodo - Callback to create a new todo.
 * @param {(id: string, updates: Object) => Promise<Object>} props.handleUpdateTodo - Callback to update a todo.
 * @param {(id: string) => Promise<Object>} props.handleToggleTodo - Callback to toggle todo completion status.
 * @param {(todo: Object) => void} props.handleEditTodo - Callback to open edit dialog for a todo.
 * @param {() => void} props.handleCloseEditDialog - Callback to close the edit dialog.
 * @param {boolean} props.showEditDialog - Whether to show the edit dialog.
 * @param {Object} props.editingTodo - The todo being edited.
 * @param {(date: Date) => void} props.setCurrentDate - Callback to change the current month.
 * @param {(date: Date) => void} props.setSelectedDate - Callback to set the selected date.
 */
export default function CalendarView({
  user,
  todos,
  currentDate,
  selectedDate,
  calendarDays,
  todosForSelectedDate,
  handleCreateTodo,
  handleUpdateTodo,
  handleToggleTodo,
  handleEditTodo,
  handleCloseEditDialog,
  showEditDialog,
  editingTodo,
  setCurrentDate,
  setSelectedDate,
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                >
                  <ChevronLeft />
                </Button>
                <CardTitle className="text-xl font-semibold">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                >
                  <ChevronRight />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day.date && setSelectedDate(day.date)}
                      className={`relative aspect-square rounded-md flex flex-col items-center justify-center p-1 text-lg transition-colors duration-200
                          ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                          ${day.isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-200"}
                          ${day.isToday && !day.isSelected ? "bg-gray-200" : ""}
                          ${!day.date ? "cursor-default" : ""}`}
                      disabled={!day.date}
                    >
                      {day.date && <span>{day.date.getDate()}</span>}
                      {day.todos.length > 0 && (
                        <div
                          className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${day.isSelected ? "bg-white" : "bg-blue-500"}`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-8">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {selectedDate ? `Tasks for ${selectedDate.toLocaleDateString()}` : "Select a date"}
                </CardTitle>
                <TodoForm
                  onSubmit={handleCreateTodo}
                  trigger={
                    <Button variant="ghost" size="sm" disabled={!selectedDate}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  }
                  initialDueDate={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                />
              </CardHeader>
              <CardContent>
                {todosForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {todosForSelectedDate
                      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                      .map((todo) => (
                        <div key={todo.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{todo.title}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{todo.priority}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTodo(todo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {selectedDate ? "No tasks for this date." : "Please select a date to view tasks."}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todos
                    .filter((todo) => {
                      const dueDate = new Date(todo.dueDate)
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return !todo.completed && todo.dueDate && !isNaN(dueDate.getTime()) && dueDate >= today
                    })
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 5)
                    .map((todo) => {
                      const daysUntilDue = Math.ceil((new Date(todo.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                      return (
                        <div key={todo.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{todo.title}</p>
                            <p className="text-xs text-gray-500">
                              {daysUntilDue === 0 ? "Due today" : `${daysUntilDue} days left`}
                            </p>
                          </div>
                        </div>
                      )
                    })}

                  {todos.filter((todo) => {
                    const dueDate = new Date(todo.dueDate)
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return !todo.completed && todo.dueDate && !isNaN(dueDate.getTime()) && dueDate >= today
                  }).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showEditDialog && editingTodo && (
          <TodoForm
            key={editingTodo.id}
            todo={editingTodo}
            onSubmit={handleUpdateTodo}
            onToggle={handleToggleTodo}
            trigger={null}
            open={showEditDialog}
            onOpenChange={handleCloseEditDialog}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}