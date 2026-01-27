import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

const baseURL = isProd
  ? process.env.NEXT_PUBLIC_RENDER_API_URL
  : process.env.NEXT_PUBLIC_LOCAL_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true, // cookies ke liye MUST
});

export default api;
