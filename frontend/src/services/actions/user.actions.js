"use server";

import { revalidatePath } from "next/cache";
import { createServerApi } from "@/services/api/axiosInstance";

export async function updateUserProfile(formData, accessToken) {
  try {
    if (!accessToken) {
      return { success: false, error: "Authentication required. Please log in again." }
    }

    // Create FormData for multipart/form-data request
    const form = new FormData()

    if (formData.name) {
      form.append("name", formData.name.trim())
    }
    if (formData.bio !== undefined) {
      form.append("bio", formData.bio.trim())
    }

    // Handle avatar based on its content:
    // 1. If it's a new image (data URL, but not SVG placeholder)
    // 2. If it's the SVG placeholder (meaning user removed original image)
    // 3. If it's the original avatar URL (meaning no change) - don't append
    if (formData.avatar) {
      if (formData.avatar.startsWith("data:image/svg+xml")) {
        form.append("avatar", "")
      } else if (formData.avatar.startsWith("data:")) {
        try {
          const response = await fetch(formData.avatar)
          const blob = await response.blob()

          if (blob.size > 2 * 1024 * 1024) {
            return { success: false, error: "Profile image is too large. Please choose a smaller image (max 2MB)." }
          }

          form.append("avatar", blob, "avatar.jpg")
        } catch (error) {
          return { success: false, error: "Failed to process avatar image." }
        }
      }
    } else {
      form.append("avatar", "")
    }

    const serverApi = createServerApi(accessToken)

    const response = await serverApi.patch("/user/me", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to update profile.")
    }

    const updatedUser = response.data
    revalidatePath("/profile")
    revalidatePath("/profile/edit")
    return { success: true, user: updatedUser }
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, error: "Authentication expired. Please log in again.", needsRefresh: true }
    }
    if (error.response?.status === 413) {
      return { success: false, error: "Profile image is too large. Please choose a smaller image (max 1MB)." }
    }

    return { success: false, error: error.response?.data?.message || error.message || "An unexpected error occurred." }
  }
}