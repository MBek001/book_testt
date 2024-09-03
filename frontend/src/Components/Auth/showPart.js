import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './SignUp';
import Login from './Login';
import UserPage from '../User/UserPage';
import AdminPage from '../Admin/AdminPage';
import Books from '../User/Books';
import Cart from '../User/cart';
import Profile from '../User/UserProfile';

const ShowPart = () => {
    return (
        <div className="container-fluid">
            <Routes>
                <Route path="/" element={<UserPage />} /> {/* Home page route */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/books" element={<Books />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/userprofile" element={<Profile />} />
                <Route path="/admin/*" element={<AdminPage />} /> {/* Admin panel route */}
                <Route path="/home/*" element={<UserPage />} /> {/* UserPage route with nested routes */}
            </Routes>
        </div>
    );
};

export default ShowPart;
