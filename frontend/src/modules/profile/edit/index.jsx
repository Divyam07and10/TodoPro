"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getCachedUserProfile, getCurrentAccessToken } from "@/services/auth/auth.service"
import { updateUserProfile } from "@/services/actions/user.actions"
import { toast } from "sonner"
import EditProfileView from "./view"

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"]

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: "", bio: "", avatar: null })
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadUserProfile = useCallback(async () => {
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
        setFormData({
          name: currentUser.name || "",
          bio: currentUser.bio || "",
          avatar: currentUser.avatar || null,
        })
        setImagePreview(currentUser.avatar || null)
      }

      currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      setUser(currentUser)
      setFormData({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        avatar: currentUser.avatar || null,
      })
      setImagePreview(currentUser.avatar || null)

    } catch (err) {
      console.error("Error loading profile for edit:", err)
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
    loadUserProfile()
  }, [loadUserProfile])

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Invalid file type.", {
          description: "Please upload a JPEG, JPG, PNG, or GIF image.",
        })
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large.", {
          description: "Please upload an image smaller than 2MB.",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData((prev) => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, avatar: null }))
    setImagePreview(null)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const currentToken = getCurrentAccessToken()
    if (!currentToken) {
      toast.error("Authentication required. Please log in again.")
      setSubmitting(false)
      router.push("/login")
      return
    }

    const payload = { ...formData }

    try {
      const result = await updateUserProfile(payload, currentToken)

      if (result.success) {
        toast.success("Profile Updated!", {
          description: "Your profile has been successfully updated.",
        })
        setTimeout(() => {
          router.push("/profile")
        }, 800)
      } else {
        toast.error("Update Failed", {
          description: result.error ?? "Unable to update profile. Please check your input or contact support.",
        })
      }
    } catch (err) {
      toast.error("Failed to update profile. Please try again.", {
        description: err.message ?? "An unexpected error occurred.",
      })
    } finally {
      setSubmitting(false)
    }
  }, [formData, router, user])

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  return (
    <EditProfileView
      user={user}
      loading={loading}
      submitting={submitting}
      formData={formData}
      imagePreview={imagePreview}
      isPlaceholderImage={!imagePreview}
      fileInputRef={fileInputRef}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleImageUpload={handleImageUpload}
      handleRemoveImage={handleRemoveImage}
    />
  )
}