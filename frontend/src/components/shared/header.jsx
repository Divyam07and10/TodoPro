"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckSquare, Calendar, LayoutDashboard, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser, signOut, getCachedUserProfile } from "@/services/auth/auth.service"
import { useEffect, useState } from "react"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      // Try to get cached profile first for immediate display
      let currentUser = getCachedUserProfile()
      if (currentUser) {
        setUser(currentUser)
      }

      // Then, attempt to get current user from API to validate session
      currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      } else {
        // If no current user, explicitly set user to null
        setUser(null)
      }
      setLoading(false)
    }
    fetchUser()
  }, []) // No need for router or pathname in dependencies here, as Header just checks auth status

  // If still loading, show a minimal header with a spinner
  if (loading) {
    return (
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <CheckSquare className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TodoPro</span>
            </Link>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </header>
    )
  }

  // If not loading and no user is found (meaning no access token), do not render the header
  if (!user) {
    return null
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: Calendar },
  ]

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <CheckSquare className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TodoPro</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {user?.avatar && user.avatar !== "" && !user.avatar.startsWith("/placeholder.svg") ? (
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name || "User Avatar"}
                      width={32}
                      height={32}
                    />
                  ) : null}
                  <AvatarFallback className="bg-blue-500 text-white">{user?.name ? user.name[0] : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}