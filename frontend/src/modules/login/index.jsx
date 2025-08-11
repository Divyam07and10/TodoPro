"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, signInWithGoogle } from "@/services/auth/auth.service"
import { toast } from "sonner"
import LoginView from "./view"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialCheck, setInitialCheck] = useState(true)
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const authError = urlParams.get("error")
        if (authError) {
          setError("Authentication failed. Please try again.")
          router.replace("/login", undefined, { shallow: true })
          setInitialCheck(false)
          return
        }

        const user = await getCurrentUser()
        if (user) {
          console.log("User already logged in, redirecting to dashboard...")
          router.push("/dashboard")
        } else {
          console.log("No existing user session found.")
        }
      } catch (err) {
        console.error("Auth page initial check error:", err)
        setError("An error occurred during authentication check.")
      } finally {
        setInitialCheck(false)
      }
    }
    checkExistingSession()
  }, [router])

  const handleGoogleLogin = () => {
    if (!isTermsAccepted) {
      toast.error("Please accept the Terms of Service and Privacy Policy to continue.")
      return
    }
    setLoading(true)
    setError("")
    signInWithGoogle()
  }

  const renderDots = () => {
    const dots = []
    for (let i = 0; i < 12; i++) {
      dots.push(<div key={i} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-300 opacity-70" />)
    }
    return <div className="grid grid-cols-3 gap-4 sm:gap-6">{dots}</div>
  }

  return (
    <LoginView
      initialCheck={initialCheck}
      error={error}
      loading={loading}
      handleGoogleLogin={handleGoogleLogin}
      renderDots={renderDots}
      isTermsAccepted={isTermsAccepted}
      setIsTermsAccepted={setIsTermsAccepted}
    />
  )
}