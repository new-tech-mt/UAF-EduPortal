import axios from "axios";

const api = axios.create({
  baseURL: "https://uaf-eduportal-backend.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;