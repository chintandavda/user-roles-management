import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ Correct

const API_URL = "http://127.0.0.1:8000/api/users/";

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}login/`, credentials);
    localStorage.setItem("token", response.data.token.access);
    localStorage.setItem("role", response.data.role);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
};

export const getToken = () => localStorage.getItem("token");

export const getRole = () => localStorage.getItem("role");

export const getUserId = () => {
    const token = getToken();
    if (token) {
        const decoded = jwtDecode(token);
        return decoded.user_id; // Extract user ID from the token
    }
    return null;
};
