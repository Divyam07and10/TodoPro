import api from "@/services/api/axiosInstance";

export const getTodosByUserId = async (userId, filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    for (const key in filters) {
      if (filters[key] && filters[key] !== 'all' && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/todos?${queryString}` : "/todos";

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
    }
    console.error("Error fetching todos with filters:", error);
    return [];
  }
};
