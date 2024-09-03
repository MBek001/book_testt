import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const accessToken = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent back navigation to the admin page if the user is logged in as an admin
    if (role === 'admin') {
      window.history.pushState(null, null, window.location.href);
      window.addEventListener('popstate', () => {
        navigate('/admin/users', { replace: true });
      });

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('popstate', () => {});
      };
    }
  }, [role, navigate]);

  // Check if the user is authenticated
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Render the passed component if authenticated
  return element;
};

export default ProtectedRoute;

