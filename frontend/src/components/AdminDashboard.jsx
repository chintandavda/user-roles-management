import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/authService";
import { Card } from "antd";

const AdminDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/users/admin-dashboard/", {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            .then((res) => setData(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <Card
            title="Admin Dashboard"
            style={{ width: 400, margin: "50px auto" }}
        >
            {data ? (
                <>
                    <p>Total RMs: {data.total_rms}</p>
                    <p>Total Clients: {data.total_clients}</p>
                    <p>Pending Requests: {data.total_pending_requests}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </Card>
    );
};

export default AdminDashboard;
