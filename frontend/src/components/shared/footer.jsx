"use client"

import Link from "next/link"
import { getCurrentUser, getCachedUserProfile } from "@/services/auth/auth.service"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // State to manage loading status

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
  }, []) // Empty dependency array means this runs once on mount

  // If still loading, or if no user is found after loading, do not render the footer
  if (loading || !user) {
    return null
  }

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">TodoPro</h3>
            <p className="text-gray-600 mb-4">
              The ultimate todo application to help you stay organized and productive. Manage your tasks efficiently
              with our intuitive interface.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/features" className="hover:text-gray-900 transition-colors">
                  Task Management
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-gray-900 transition-colors">
                  Calendar View
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-gray-900 transition-colors">
                  Priority Levels
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-gray-900 transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/help" className="hover:text-gray-900 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 mt-8">
          <p className="text-center text-sm text-gray-600">© 2025 TodoPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}