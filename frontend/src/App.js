import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SendOTP from './components/SendOTP';
import VerifyOTP from './components/VerifyOTP';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/send-otp" element={<SendOTP />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
            </Routes>
        </Router>
    );
};

export default App;
