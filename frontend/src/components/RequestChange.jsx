import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../services/authService";
import { Input, Button, Card, message } from "antd";

const RequestChange = () => {
    const [requestedChanges, setRequestedChanges] = useState({
        email: "",
        username: "",
    });

    const handleChange = (e) => {
        setRequestedChanges({
            ...requestedChanges,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/users/request-change/",
                { requested_changes: requestedChanges },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            message.success(response.data.message);
            setRequestedChanges({ email: "", username: "" }); // Reset form
        } catch (error) {
            message.error("Request failed. Please try again.");
            console.error(error);
        }
    };

    return (
        <Card
            title="Request Data Change"
            style={{ width: 400, margin: "50px auto" }}
        >
            <Input
                name="email"
                placeholder="New Email"
                value={requestedChanges.email}
                onChange={handleChange}
                style={{ marginBottom: "10px" }}
            />
            <Input
                name="username"
                placeholder="New Username"
                value={requestedChanges.username}
                onChange={handleChange}
                style={{ marginBottom: "10px" }}
            />
            <Button type="primary" block onClick={handleSubmit}>
                Submit Request
            </Button>
        </Card>
    );
};

export default RequestChange;
