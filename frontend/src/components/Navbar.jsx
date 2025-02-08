import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Menu } from "antd";
import { getRole, getToken, logout } from "../services/authService";

const Navbar = () => {
    const navigate = useNavigate();
    const role = getRole();
    const isLoggedIn = !!getToken(); // Check if user is logged in

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Menu
            mode="horizontal"
            theme="dark"
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 20px",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <Link
                    to="/"
                    style={{
                        color: "white",
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginRight: "20px",
                    }}
                >
                    Home
                </Link>

                {role === "admin" && (
                    <>
                        <Link
                            to="/admin-dashboard"
                            style={{ color: "white", marginRight: "15px" }}
                        >
                            Admin
                        </Link>
                        <Link
                            to="/register-rm"
                            style={{ color: "white", marginRight: "15px" }}
                        >
                            Register RM
                        </Link>
                        <Link
                            to="/admin-rms"
                            style={{ color: "white", marginRight: "15px" }}
                        >
                            View RMs & Clients
                        </Link>
                    </>
                )}

                {role === "rm" && (
                    <>
                        <Link
                            to="/rm-dashboard"
                            style={{ color: "white", marginRight: "15px" }}
                        >
                            RM
                        </Link>
                        <Link
                            to="/register-client"
                            style={{ color: "white", marginRight: "15px" }}
                        >
                            Register Client
                        </Link>
                        <Link
                            to="/view-requests"
                            style={{ color: "white", marginRight: "15px" }}
                        >
                            View Requests
                        </Link>
                    </>
                )}

                {role === "client" && (
                    <>
                        <Link
                            to="/client-dashboard"
                            style={{ color: "white", marginRight: "15px" }}
                        >
                            Client
                        </Link>
                        <Link
                            to="/request-change"
                            style={{ color: "white", marginRight: "15px" }}
                        >
                            Request Change
                        </Link>
                    </>
                )}
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
                {!isLoggedIn ? (
                    <Button type="primary" onClick={() => navigate("/")}>
                        Login
                    </Button>
                ) : (
                    <Button type="primary" danger onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </div>
        </Menu>
    );
};

export default Navbar;
