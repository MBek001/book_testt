import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import view from './img/view.png'
import hide from './img/hide.png'
import './auth.css';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); // Add state for error messages
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }


        const signupDate = new Date().toISOString();

        try {
            const response = await axios.post('http://0.0.0.0:8000/auth/registration', {
                name: fullName,
                email,
                phone_number: phone,
                password1: password,
                password2: confirmPassword,
                signup_date: signupDate
            });

            console.log('Signup successful', response.data);
            console.log(response.data.success)

            if (response.data.success == true) {
                navigate('/login');
            }
            else{
                setError('This email already exists.');
            }
            
        } catch (error) {
            if (error.response && error.response.data) {
                const errorDetail = error.response.data.detail || 'Signup failed. Please check your input.';
                setError(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail, null, 2));
            } else {
                setError('Network error. Please try again later.');
            }
            console.error('Signup error:', error.response ? error.response.data : error);
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
                        <h1>Sign up to <br /> <span>Lorem ipsum dolor sit</span></h1>
                        <p>
                            If you already have an account <br />
                            You can <Link to='/login'>Login here!</Link>
                        </p>
                    </div>
                </div>
                <div className="right-side">
                    <div className="signup-part">
                        <form onSubmit={handleSignup}>
                            <h1>Sign Up</h1>
                            <div>
                                <input 
                                    type="text" 
                                    value={fullName} 
                                    placeholder='Enter your full name' 
                                    onChange={(e) => setFullName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div>
                                <input 
                                    type="email" 
                                    value={email} 
                                    placeholder='Enter your email' 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    placeholder='Enter your phone number' 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className='shw2'>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password} 
                                    placeholder='Enter your password' 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                /> 
                                 <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                                    className="show-password-btn2"
                                >
                                     <img className='pasimg' src={showPassword ? view : hide}/>
                                </button>
                            </div>
                            <div className='shw2'>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword} 
                                    placeholder='Confirm your password' 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                />
                    

                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <button type="submit">Signup</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
