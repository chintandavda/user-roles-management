import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/authService";
import { Table, Button, message, Card } from "antd";

const ViewRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/users/rm/view-requests/", {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            .then((res) => setRequests(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleAction = async (id, status) => {
        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/users/rm/update-request/${id}/`,
                { status },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            message.success(`Request ${status}`);
            setRequests(requests.filter((req) => req.id !== id)); // Remove from list
        } catch (error) {
            message.error("Action failed. Please try again.");
            console.error(error);
        }
    };

    return (
        <Card
            title="Pending Requests"
            style={{ width: "80%", margin: "50px auto" }}
        >
            <Table
                dataSource={requests}
                columns={[
                    { title: "Client", dataIndex: "client", key: "client" },
                    {
                        title: "Changes",
                        dataIndex: "requested_changes",
                        key: "requested_changes",
                    },
                    { title: "Status", dataIndex: "status", key: "status" },
                    {
                        title: "Actions",
                        render: (_, record) => (
                            <>
                                <Button
                                    onClick={() =>
                                        handleAction(record.id, "approved")
                                    }
                                    type="primary"
                                >
                                    Approve
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleAction(record.id, "rejected")
                                    }
                                    danger
                                    style={{ marginLeft: "10px" }}
                                >
                                    Reject
                                </Button>
                            </>
                        ),
                    },
                ]}
            />
        </Card>
    );
};

export default ViewRequests;
