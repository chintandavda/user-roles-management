import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../services/authService";
import { Input, Button, Card, message } from "antd";

const RequestChange = () => {
    const [requestedChanges, setRequestedChanges] = useState({
        task: "",
        description: "",
    });

    const handleChange = (e) => {
        setRequestedChanges({
            ...requestedChanges,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        if (!requestedChanges.task || !requestedChanges.description) {
            message.error("Both Task and Description are required.");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/users/request-change/",
                { requested_changes: requestedChanges }, // Sending new fields
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            message.success(response.data.message);
            setRequestedChanges({ task: "", description: "" }); // Reset form
        } catch (error) {
            message.error("Request failed. Please try again.");
            console.error(error);
        }
    };

    return (
        <Card
            title="Request a Change"
            style={{ width: 400, margin: "50px auto" }}
        >
            <Input
                name="task"
                placeholder="Enter Task"
                value={requestedChanges.task}
                onChange={handleChange}
                style={{ marginBottom: "10px" }}
            />
            <Input.TextArea
                name="description"
                placeholder="Enter Description"
                value={requestedChanges.description}
                onChange={handleChange}
                style={{ marginBottom: "10px" }}
                rows={4}
            />
            <Button type="primary" block onClick={handleSubmit}>
                Submit Request
            </Button>
        </Card>
    );
};

export default RequestChange;
