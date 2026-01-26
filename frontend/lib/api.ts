import axios from "axios";

const api = axios.create({
  baseURL: "https://ompay-backend-uy57.onrender.com/api/v1",
  withCredentials: true, // VERY IMPORTANT
});

export default api;
