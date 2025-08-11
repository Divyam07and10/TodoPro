import api from "@/services/api/axiosInstance";

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8000";

export const signInWithGoogle = () => {
  window.location.href = `${AUTH_API_URL}/auth/google`;
};

export const getCurrentUser = async () => {
  try {
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      return null;
    }

    const response = await api.get("/user/me");

    if (response.status === 200) {
      const user = response.data;
      sessionStorage.setItem("currentUserProfile", JSON.stringify(user));
      return user;
    } else {
      return null;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      // Interceptor should handle refresh, if it fails, it will redirect
    }
    return null;
  }
};

export const getCachedUserProfile = () => {
  if (typeof window !== "undefined") {
    const userProfile = sessionStorage.getItem("currentUserProfile");
    return userProfile ? JSON.parse(userProfile) : null;
  }
  return null;
};

export const setAccessToken = (newToken) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("access_token", newToken);
  }
};

export const getCurrentAccessToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("access_token");
  }
  return null;
};

export const hasValidToken = () => {
  if (typeof window !== "undefined") {
    const accessToken = sessionStorage.getItem("access_token");
    return !!accessToken;
  }
  return false;
};

export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/auth/refresh");

    if (response.data?.access_token) {
      const newAccessToken = response.data.access_token;
      setAccessToken(newAccessToken);
      return newAccessToken;
    } else {
      throw new Error("No access token in refresh response");
    }
  } catch (error) {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("currentUserProfile");

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    throw error;
  }
};

export const signOut = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Error during backend logout:", error);
  } finally {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("currentUserProfile");
      window.location.href = "/login";
    }
  }
};
