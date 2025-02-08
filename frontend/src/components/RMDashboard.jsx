import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUserId } from "../services/authService";
import { Card } from "antd";

const RMDashboard = () => {
    const [data, setData] = useState(null);
    const userId = getUserId(); // Get logged-in RM ID

    useEffect(() => {
        if (userId) {
            axios
                .get(
                    `http://127.0.0.1:8000/api/users/rm-dashboard/${userId}/`,
                    {
                        headers: { Authorization: `Bearer ${getToken()}` },
                    }
                )
                .then((res) => setData(res.data))
                .catch((err) => console.error(err));
        }
    }, [userId]);

    return (
        <Card title="RM Dashboard" style={{ width: 400, margin: "50px auto" }}>
            {data ? (
                <>
                    <p>Total Clients: {data.total_clients}</p>
                    <p>Pending Requests: {data.pending_requests}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </Card>
    );
};

export default RMDashboard;
