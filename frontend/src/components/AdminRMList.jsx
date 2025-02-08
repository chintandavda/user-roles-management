import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/authService";
import { Card, Table, Collapse, message } from "antd";

const { Panel } = Collapse;

const AdminRMList = () => {
    const [rms, setRMs] = useState([]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/users/admin/rms-clients/", {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            .then((res) => setRMs(res.data))
            .catch((err) => {
                console.error(err);
                message.error("Failed to load RM and client data");
            });
    }, []);

    return (
        <Card
            title="List of RMs and Associated Clients"
            style={{ width: "80%", margin: "50px auto" }}
        >
            <Collapse accordion>
                {rms.map((rm) => (
                    <Panel
                        header={`RM: ${rm.username} (${rm.email}) - Clients: ${rm.total_clients}`}
                        key={rm.id}
                    >
                        <Table
                            dataSource={rm.clients}
                            columns={[
                                {
                                    title: "Client ID",
                                    dataIndex: "id",
                                    key: "id",
                                },
                                {
                                    title: "Username",
                                    dataIndex: "username",
                                    key: "username",
                                },
                                {
                                    title: "Email",
                                    dataIndex: "email",
                                    key: "email",
                                },
                            ]}
                            rowKey="id"
                            pagination={false}
                        />
                    </Panel>
                ))}
            </Collapse>
        </Card>
    );
};

export default AdminRMList;
