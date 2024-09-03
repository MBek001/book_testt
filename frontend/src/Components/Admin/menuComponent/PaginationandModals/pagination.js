import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

function Pagination() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  // Set up an Axios interceptor to refresh the token if needed
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem('accessToken');
        config.headers.Authorization = `Bearer ${token}`;

        // Check token expiration here (this example assumes a simple timestamp comparison)
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        const now = new Date().getTime();
        
        if (tokenExpiry && now >= tokenExpiry) {
          try {
            await refreshAccessToken(); // Call function to refresh token
            config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
          } catch (err) {
            console.error('Token refresh failed', err);
            setError('Session expired. Please log in again.');
            // Optionally, redirect to login
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor); // Clean up the interceptor on component unmount
    };
  }, []);

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      const storedEmail = localStorage.getItem('email');
      const storedPassword = localStorage.getItem('password'); // You need to securely store and retrieve password

      if (storedEmail && storedPassword) {
        const response = await axios.post('http://0.0.0.0:8000/auth/login', {
          email: storedEmail,
          password: storedPassword,
        });

        const newAccessToken = response.data.token.access;
        const newRefreshToken = response.data.token.refresh;
        const tokenExpiry = new Date().getTime() + 3600 * 1000; // Example: 1-hour expiry

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('tokenExpiry', tokenExpiry); // Save new expiry time
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  // Function to fetch users
  const getUsers = async () => {
    try {
      const response = await axios.get('http://0.0.0.0:8000/auth/all_users_info');
      setUsers(response.data); // Set the users data to state
    } catch (err) {
      setError(err.message); // Set error message to state
    }
  };

  // Use useEffect to call getUsers when the component mounts
  useEffect(() => {
    getUsers();
  }, []); // Empty dependency array means this runs once after the initial render

  // Function to handle user deletion
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://0.0.0.0:8000/auth/delete-user`, {
        params: { user_id: id }
      });
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    } catch (err) {
      console.error('Error deleting user:', err.message);
      if (err.response && err.response.status === 500) {
        setError('Internal Server Error. Please try again later.');
      } else {
        setError('Failed to delete user');
      }
    }
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Filter and search logic
  const filteredUsers = users
    .filter((user) => {
      // Filter by user role (Admin/Non-Admin) based on selected filter
      if (filter === 'Admin' && !user.is_admin) return false;
      if (filter === 'Non-Admin' && user.is_admin) return false;
      return true;
    })
    .filter((user) => {
      // Search by user name, email, or phone number
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  return (
    <div className='w'>
      <div className='search-filter-bar'>
        <input
          type='search'
          placeholder='Search user...'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={filter} onChange={handleFilterChange}>
          <option value='All'>All</option>
          <option value='Admin'>Admin</option>
          <option value='Non-Admin'>Non-Admin</option>
        </select>
      </div>
      <div className='Tab2'>
      <table className='table table-hover z '>
        <thead>
          <tr>
            <th>Id</th>
            <th>FullName</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Date</th>
            <th>Is Admin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {error && <p className="error-message">{error}</p>}
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>{user.date_joined}</td>
              <td>{user.is_admin ? 'Yes' : 'No'}</td>
              <td>
                <button 
                  className='btn btn-danger d' 
                  onClick={() => handleDelete(user.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Pagination;
