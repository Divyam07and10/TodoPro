import axios from "axios";

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const clientApi = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
  timeout: 10000,
});

clientApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = sessionStorage.getItem("access_token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      if (API_KEY) {
        config.headers["x-api-key"] = API_KEY;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

clientApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshTokenResponse = await axios.post(
          `${AUTH_API_URL}/auth/refresh`,
          {},
          { withCredentials: true, headers: { "x-api-key": API_KEY } }
        );
        if (refreshTokenResponse.data?.access_token) {
          const newAccessToken = refreshTokenResponse.data.access_token;
          sessionStorage.setItem("access_token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return clientApi(originalRequest);
        }
      } catch (refreshError) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("currentUserProfile");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const createServerApi = (accessToken) => {
  const serverApi = axios.create({
    baseURL: AUTH_API_URL,
    withCredentials: true,
    timeout: 10000,
  });

  if (accessToken) {
    serverApi.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  if (API_KEY) {
    serverApi.defaults.headers.common["x-api-key"] = API_KEY;
  }

  serverApi.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  serverApi.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return serverApi;
};

export default clientApi;