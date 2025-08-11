import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import TodoForm from "@/components/todo/todo-form"
import TodoFilters from "@/components/todo/todo-filters"
import TodoCard from "@/components/todo/todo-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle, List } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function DashboardView({
  user,
  stats,
  loading,
  sortedCategories,
  filters,
  showEditDialog,
  editingTodo,
  handleCreateTodo,
  handleUpdateTodo,
  handleDeleteTodo,
  handleToggleTodo,
  handleEditTodo,
  handleCloseEditDialog,
  handleResetFilters,
  setFilters,
}) {
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}! Here's your todo overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TodoForm onSubmit={handleCreateTodo} />
        </div>

        <TodoFilters filters={filters} onFiltersChange={setFilters} onResetFilters={handleResetFilters} />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading todos...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedCategories.map((category) => {
              const todosInThisCategory = category.todos || []
              if (todosInThisCategory.length === 0) {
                return null
              }
              return (
                <Card key={category.value} className="bg-white shadow-sm border border-gray-200">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={category.value}>
                      <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-gray-900 hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            <span>{category.label}</span>
                          </div>
                          <Badge variant="secondary" className="text-gray-600">
                            {todosInThisCategory.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                          {todosInThisCategory.map((todo) => (
                            <TodoCard
                              key={todo.id}
                              todo={todo}
                              onUpdate={handleUpdateTodo}
                              onDelete={handleDeleteTodo}
                              onToggle={handleToggleTodo}
                              onEdit={handleEditTodo}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              )
            })}
            {Object.values(sortedCategories).every((cat) => cat.todos.length === 0) && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No todos found for any category</p>
                <p className="text-gray-400">Try adjusting your filters or create a new todo!</p>
              </div>
            )}
          </div>
        )}

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