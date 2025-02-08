import React, { useState } from "react";
import axios from "axios";
import { getToken, getUserId } from "../services/authService";
import { Input, Button, Card, message } from "antd";

const RegisterClient = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const rmId = getUserId(); // Get logged-in RM ID

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.email || !formData.password) {
            message.error("All fields are required");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/users/register-client/",
                { ...formData, rm_id: rmId }, // Attach RM ID
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            message.success("Client registered successfully");
            setFormData({ username: "", email: "", password: "" });
        } catch (error) {
            message.error("Registration failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title="Register Client"
            style={{ width: 400, margin: "50px auto" }}
        >
            <Input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
            />
            <Input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={{ marginTop: "10px" }}
            />
            <Input.Password
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{ marginTop: "10px" }}
            />
            <Button
                type="primary"
                block
                onClick={handleSubmit}
                loading={loading}
                style={{ marginTop: "10px" }}
            >
                Register Client
            </Button>
        </Card>
    );
};

export default RegisterClient;
