import axios, { AxiosInstance, AxiosError } from "axios";

const axiosClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
    timeout: 60000,
});

// Request interceptor to add headers
axiosClient.interceptors.request.use(
    (config) => {
        config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error("Response interceptor error:", error);
        if (error.response) {
            const message = (error.response.data as any)?.error || "Server error occurred";
            return Promise.reject(new Error(message));
        } else if (error.code === "ECONNABORTED") {
            return Promise.reject(new Error("Request timed out. Please try again."));
        } else if (error.code === "ERR_NETWORK") {
            return Promise.reject(new Error("Network error. Please check your connection."));
        }
        return Promise.reject(new Error("Failed to process request."));
    }
);

export default axiosClient;
