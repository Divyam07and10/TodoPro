import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import { Toaster } from "@/components/ui/sonner"

export default function ProfileView({ user, todos, stats, loading, joinDate }) {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  {user.avatar && user.avatar !== "" ? (
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name || "User Avatar"}
                      width={96}
                      height={96}
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-500 text-white">{user.name ? user.name[0] : "U"}</AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                      <p className="text-gray-600 flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-2" />
                        {user.email}
                      </p>
                    </div>

                    <div className="flex space-x-3 mt-4 sm:mt-0">
                      <Link href="/profile/edit">
                        <Button>
                          <Edit className="h-4 w-4 mr-2" />
                          Update Profile
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {user.bio && <p className="text-gray-700 mt-4">{user.bio}</p>}

                  <div className="flex items-center space-x-4 mt-4">
                    <Badge variant="secondary" className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Joined {joinDate}
                    </Badge>
                    <Badge variant="outline">{stats.completionRate}% Completion Rate</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <p className="text-sm text-gray-600">Total Tasks</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                      <p className="text-sm text-gray-600">Overdue</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todos.slice(0, 5).map((todo) => (
                      <div key={todo.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${todo.completed ? "bg-green-500" : "bg-yellow-500"}`} />
                        <div className="flex-1">
                          <p className={`font-medium ${todo.completed ? "line-through text-gray-500" : ""}`}>
                            {todo.title ?? "Untitled Task"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {todo.completed ? "Completed" : "Pending"} • {new Date(todo.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {todos.length === 0 && <p className="text-gray-500 text-center py-4">No recent activity</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productivity Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>{stats.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${stats.completionRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>• {stats.completed} tasks completed this month</p>
                      <p>• {stats.pending} tasks remaining</p>
                      {stats.overdue > 0 && <p className="text-red-600">• {stats.overdue} overdue tasks</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}