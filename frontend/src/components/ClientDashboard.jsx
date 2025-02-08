import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUserId } from "../services/authService";
import { Card } from "antd";

const ClientDashboard = () => {
    const [data, setData] = useState(null);
    const userId = getUserId();

    useEffect(() => {
        if (userId) {
            axios
                .get(
                    `http://127.0.0.1:8000/api/users/client-dashboard/${userId}/`,
                    {
                        headers: { Authorization: `Bearer ${getToken()}` },
                    }
                )
                .then((res) => setData(res.data))
                .catch((err) => console.error(err));
        }
    }, [userId]);

    return (
        <Card
            title="Client Dashboard"
            style={{ width: 400, margin: "50px auto" }}
        >
            {data ? (
                <>
                    <p>Username: {data.username}</p>
                    <p>Email: {data.email}</p>
                    <p>
                        Assigned RM:{" "}
                        {data.rm
                            ? `${data.rm.username} (ID: ${data.rm.id})`
                            : "None"}
                    </p>
                    <p>Total Requests: {data.total_requests}</p>
                    <p>Pending Requests: {data.pending_requests}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </Card>
    );
};

export default ClientDashboard;
