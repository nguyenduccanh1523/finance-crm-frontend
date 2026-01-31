// src/lib/api/axiosClient.ts
import axios from "axios"
import { store } from "@/app/store"
import { clearUser, setUser } from "@/app/store/authSlice"

const apiBaseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export const axiosClient = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true, // quan trọng: để cookie JWT đi kèm
})

// helper để tránh gọi refresh nhiều lần cùng lúc
let isRefreshing = false
let pendingRequests: (() => void)[] = []

function addPendingRequest(cb: () => void) {
  pendingRequests.push(cb)
}

function runPendingRequests() {
  pendingRequests.forEach((cb) => cb())
  pendingRequests = []
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // đánh dấu retry để tránh loop vô hạn
    originalRequest._retry = true

    if (isRefreshing) {
      // chờ refresh xong rồi retry
      return new Promise((resolve, reject) => {
        addPendingRequest(() => {
          axiosClient(originalRequest)
            .then(resolve)
            .catch(reject)
        })
      })
    }

    isRefreshing = true

    try {
      // Gọi API refresh (cookie refresh token nằm trong HttpOnly cookie)
      const refreshRes = await axiosClient.post("/auth/refresh")
      const user = refreshRes.data?.user
      if (user) {
        store.dispatch(setUser(user))
      }

      runPendingRequests()
      return axiosClient(originalRequest)
    } catch (refreshError) {
      store.dispatch(clearUser())
      runPendingRequests()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
