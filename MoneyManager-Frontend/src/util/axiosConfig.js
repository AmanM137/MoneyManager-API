import axios from "axios";
import { BASE_URL } from "./apiEndpoints";

const axiosConfig = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Endpoints that do NOT require token
const excludeEndpoints = ["/login", "/register", "/status", "/activate", "/health"];

// Request interceptor: attach JWT token
axiosConfig.interceptors.request.use(
    (config) => {
        const shouldSkipToken = excludeEndpoints.some((endpoint) =>
            config.url?.includes(endpoint)
        );

        if (!shouldSkipToken) {
            const accessToken = localStorage.getItem("token");
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401, 403, 500, timeout
axiosConfig.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401 || status === 403) {
                console.warn(
                    `Unauthorized or Forbidden (${status}). Logging out and redirecting to login.`
                );
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            } else if (status === 500) {
                console.error("Server error. Please try again later");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again");
        }

        return Promise.reject(error);
    }
);

export default axiosConfig;
