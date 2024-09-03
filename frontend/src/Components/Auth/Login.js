import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import view from './img/view.png';
import hide from './img/hide.png';
import './auth.css';

const Login = () => {
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedRole = localStorage.getItem('role');

        if (storedToken && storedRole) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

            if (storedRole === 'admin') {
                navigate('/admin/users', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }

        // Clear email and password on component mount
        setEmail('');
        setPassword('');

        // Clean up function to clear state when component unmounts
        return () => {
            setEmail('');
            setPassword('');
        };
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://0.0.0.0:8000/auth/login', {
                email,
                password,
            });

            const accessToken = response.data.token.access;
            const refreshToken = response.data.token.refresh;
            const role = response.data.role;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('role', role);
            localStorage.setItem('email', email); // Store email for auto-login

            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            setErrorMessage('');

            if (role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            setErrorMessage('Something went wrong , check email or password is correct');
        }
    };

    const handleCancel = () => {
        navigate('/home', { replace: true });
    };

    return (
        <div className='container'>
            <div className="head">
                <h3>Your Logo</h3>
                <button onClick={handleCancel} className="cancel-button">Cancel ❌</button>
            </div>
            <div className="body-part">
                <div className="left-side">
                    <div className="text-part">
                        <h1>Log In to <br /> <span>Lorem ipsum dolor sit</span></h1>
                        <p>
                            If you don’t have an account <br />
                            You can <Link to='/signup'>Register here</Link>
                        </p>
                    </div>
                </div>
                <div className="right-side">
                    <div className="login-part">
                        <form onSubmit={handleLogin}>
                            <h1>Log In</h1>
                            <div>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={email} 
                                    placeholder="Enter your email" 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className='shw'>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    id="password" 
                                    name="password" 
                                    value={password} 
                                    placeholder="Enter your password" 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />

                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="show-password-btn"
                                >
                                    <img className='pasimg' src={showPassword ? view : hide} alt="Toggle Password Visibility" />
                                </button>
                            </div>
                            {errorMessage && <p className="error-message mt-3 mb-3">{errorMessage}</p>}
                            <p><Link to='/forgot-password'>Forgot password?</Link></p>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
