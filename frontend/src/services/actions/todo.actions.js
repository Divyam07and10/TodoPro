"use server";

import { revalidatePath } from "next/cache";
import { createServerApi } from "@/services/api/axiosInstance";

export async function createTodo(formData, accessToken) {
  try {
    if (!accessToken) {
      return { success: false, error: "Authentication required. Please log in again." };
    }

    const serverApi = createServerApi(accessToken);
    const response = await serverApi.post("/todos", formData);

    if (response.status !== 201) {
      throw new Error(response.data.message || "Failed to create todo.");
    }

    revalidatePath("/dashboard");
    revalidatePath("/calendar");
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, error: "Authentication expired. Please log in again.", needsRefresh: true };
    }
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || "Invalid todo data. Please check all fields.";
      return { success: false, error: errorMessage };
    }
    return { success: false, error: error.response?.data?.message || error.message || "An unexpected error occurred." };
  }
}

export async function updateTodo(id, formData, accessToken) {
  try {
    if (!accessToken) {
      return { success: false, error: "Authentication required. Please log in again." };
    }

    const serverApi = createServerApi(accessToken);
    const response = await serverApi.patch(`/todos/${id}`, formData);

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to update todo.");
    }

    revalidatePath("/dashboard");
    revalidatePath("/calendar");
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, error: "Authentication expired. Please log in again.", needsRefresh: true };
    }
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || "Invalid todo data. Please check all fields.";
      return { success: false, error: errorMessage };
    }
    return { success: false, error: error.response?.data?.message || error.message || "An unexpected error occurred." };
  }
}

export async function deleteTodo(id, accessToken) {
  try {
    if (!accessToken) {
      return { success: false, error: "Authentication required. Please log in again." };
    }

    const serverApi = createServerApi(accessToken);
    const response = await serverApi.delete(`/todos/${id}`);

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to delete todo.");
    }

    revalidatePath("/dashboard");
    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, error: "Authentication expired. Please log in again.", needsRefresh: true };
    }
    return { success: false, error: error.response?.data?.message || error.message || "An unexpected error occurred." };
  }
}
