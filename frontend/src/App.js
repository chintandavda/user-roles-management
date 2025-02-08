import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RegisterRM from "./pages/RegisterRM";
import RegisterClient from "./pages/RegisterClient";
import AdminDashboard from "./components/AdminDashboard";
import RMDashboard from "./components/RMDashboard";
import ClientDashboard from "./components/ClientDashboard";
import RequestChange from "./components/RequestChange";
import ViewRequests from "./components/ViewRequests";
import Navbar from "./components/Navbar";
import AdminRMList from "./components/AdminRMList";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register-rm" element={<RegisterRM />} />
        <Route path="/register-client" element={<RegisterClient />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/rm-dashboard" element={<RMDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/request-change" element={<RequestChange />} />
        <Route path="/view-requests" element={<ViewRequests />} />
        <Route path="/admin-rms" element={<AdminRMList />} />
      </Routes>
    </Router>
  );
}

export default App;
