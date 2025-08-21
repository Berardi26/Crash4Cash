// utils/axios.ts
import { addToast } from "@heroui/react";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => {
    if (response.data?.message) {
      addToast({
        title: response.data.message,
        color: response.data.type,
        timeout: 3000,
      })
    }
    return response;
  },
  (error) => {
    addToast({
      title: error.response?.data?.error || "Request failed" ,
      color: "danger",
      timeout: 3000,
    })
    return Promise.reject(error);
  }
);

export default api;
