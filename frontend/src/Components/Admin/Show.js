// Show.js
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Orders from './menuComponent/Orders';
import Product from './menuComponent/Product';
import Create from './menuComponent/Create';
import History from './menuComponent/History';
import ProtectedRoute from './linkProtect/ProtectedRoute'; // Import ProtectedRoute

function Show() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the access token and other relevant data from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('refreshToken'); // Remove refresh token if used
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('email')  // Remove token expiry if used
    
        // Remove the default Authorization header from Axios
        delete axios.defaults.headers.common['Authorization'];
    
        // Redirect the user to the login page
        navigate('/login');
    };
    

    return (
        <div className="center">
            <div className="header">
                <button className="logout" onClick={handleLogout}>Log Out</button>
            </div>
            <div className="show-side">
                <Routes>
                    <Route path="users" element={<ProtectedRoute element={<Orders />} />} />
                    <Route path="product" element={<ProtectedRoute element={<Product />} />} />
                    <Route path="create" element={<ProtectedRoute element={<Create />} />} />
                    <Route path="newRelease" element={<ProtectedRoute element={<History />} />} />
                    <Route path="/" element={<Navigate to="users" />} />
                </Routes>
            </div>
        </div>
    );
}

export default Show;
