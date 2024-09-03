import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './userprofile.css'
import profileImg from './img/blank-profile-picture-973460_1280.png'
import view from '../Auth/img/view.png'
import hide from '../Auth/img/hide.png'

const UserProfile = () => {
    const [user, setUser] = useState({ name: '', email: '', phone_number: '' });
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone ,setPhone] = useState('')
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        if (!localStorage.getItem('refreshToken')) {
            navigate('/signup');
            return; // Prevent further code execution
        }
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('refreshToken'); // Use accessToken instead of refreshToken
                const response = await axios.get('http://0.0.0.0:8000/auth/user_info', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const userData = response.data[0];
                setUser(userData);
                setName(userData.name);
                setEmail(userData.email);
                setPhone(userData.phone_number)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('email')

        // Remove the default Authorization header from Axios
        delete axios.defaults.headers.common['Authorization'];

        // Redirect the user to the login page
        navigate('/login');
    };

    // const handleProfileUpdate = async () => {
    //     try {
    //         const token = localStorage.getItem('accessToken'); // Use accessToken instead of refreshToken
    //         await axios.patch(
    //             'http://167.99.250.93:8000/auth/edit-profile',
    //             {
    //                 name,
    //                 email
    //             },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json' // Set Content-Type header for JSON payload
    //                 }
    //             }
    //         );
    //         console.log('Profile updated successfully');
    //     } catch (error) {
    //         console.error('Error updating profile:', error);
    //     }
    // };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='userContainer'>
            <div className='profile-head'>
              <a href='/' className='text text-danger'>Cancel</a>
            </div>
            <div className='profile-body'>
             <div className='profileCart'>
               <div className='photoProf'>
                    <img src={profileImg}  alt='Profile Phot'/>
               </div>
               <div className='bodyProf'>
                  <div>
                      <p>
                         Full Name
                      </p>
                      <h4>{name.charAt(0).toUpperCase() + name.slice(1)}</h4>
                  </div>
                  <div>
                     <p>
                         E-mail adress
                      </p>
                      <h5>{email}</h5>
                  </div>
                  <div>
                      <p>
                         Phone Number
                      </p>
                      <h5>{phone}</h5>
                  </div>
               </div>
            
            </div>

            <div className='secondCart'>
              <div className='head-second-cart'>
                 <h2>Profile Setting</h2>
              </div>
              <div className='body-second-cart'>
                <div className='body-second-left'>
                <label>Name</label>
                 <input type='text' value={name}/>
                <label>New Password</label>
                 <input type={showPassword ? "text" : "password"}  placeholder='Password'/>
                 <button 
                       type="button" 
                       onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                       className="show-password-btn3"
                   > 
                        <img className='pasimg' src={showPassword ? view : hide}/>
                   </button>
                </div>
                <div className='body-second-right'>
                <label>Email</label>
                 <input type='text' value={name}/>
                <label>Confirm New Password</label>
                 <input type={showPassword ? "text" : "password"} placeholder='Confirm Password'/>
                  
                </div>
              </div>
             <div className='bottom-second-cart'>
               <button className='btn edit-prof'>Update Profile</button>
               <button className='btn btn-danger log2' onClick={handleLogout}>LogOut</button>
             </div>
            </div>
          </div>
        </div>
    );
};

export default UserProfile;
