import axios from "axios";

const api = axios.create({
  baseURL: "https://ompay-backend-uy57.onrender.com/api/v1",
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
