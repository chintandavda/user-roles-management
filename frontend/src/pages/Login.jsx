import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, getToken, getRole } from "../services/authService";
import { Input, Button, Card, message } from "antd";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, redirect them
        const token = getToken();
        const role = getRole();

        if (token) {
            if (role === "admin") navigate("/admin-dashboard");
            else if (role === "rm") navigate("/rm-dashboard");
            else if (role === "client") navigate("/client-dashboard");
        }
    }, [navigate]);

    const handleLogin = async () => {
        if (!username || !password) {
            message.error("Username and password are required");
            return;
        }

        setLoading(true);
        try {
            const data = await login({ username, password });
            message.success("Login successful");
            if (data.role === "admin") navigate("/admin-dashboard");
            else if (data.role === "rm") navigate("/rm-dashboard");
            else navigate("/client-dashboard");
        } catch (error) {
            message.error("Invalid credentials. Please try again.");
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Login" style={{ width: 400, margin: "100px auto" }}>
            <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginTop: "10px" }}
            />
            <Button
                type="primary"
                block
                onClick={handleLogin}
                loading={loading}
                style={{ marginTop: "10px" }}
            >
                Login
            </Button>
        </Card>
    );
};

export default Login;
