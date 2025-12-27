import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig.js";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";

export const useUser = () => {
    const { user, setUser, clearUser } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchUserInfo = async () => {
            const token = localStorage.getItem("token");

            // No token means not logged in
            if (!token) {
                clearUser();
                navigate("/login");
                return;
            }

            try {
                const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);

                if (isMounted && response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                // Handles:
                // - Server down (network error)
                // - 401 Unauthorized
                // - 403 Forbidden
                // - 500 Internal error
                console.error("User validation failed:", error.message);
                clearUser();
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        // Always verify user on mount or refresh
        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [setUser, clearUser, navigate]);
};
