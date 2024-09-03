// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ element: Component, requiredRole, ...rest }) => {
//     const token = sessionStorage.getItem('accessToken');
//     const role = sessionStorage.getItem('role');

//     if (!token) {
//         // Redirect to login if not authenticated
//         return <Navigate to="/login" />;
//     }

//     if (requiredRole && role !== requiredRole) {
//         // Redirect based on role if not authorized
//         return <Navigate to="/" />;
//     }

//     return <Component {...rest} />;
// };

// export default ProtectedRoute;
