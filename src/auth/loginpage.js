// Import necessary dependencies
import React, { useState } from 'react';
import './loginpage.css'; // Import specific CSS module for the login page
import { Link,useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import loginImage from '../assets/login-page-side.png';
import {loginWithEmailAndPassword} from '../firebase/firebase'

// Functional component for the login page
const LoginPage = () => {
  const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError]=useState(null)

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmailAndPassword(email, password);
      console.log('Logging in with:', email, password);
      navigate('/home');
    } catch (error) {
      console.error('Error signing in:', error.message);
      setLoginError(error);
    }
  };
  

  return (
    <div className='login-page'>
      <div className='login-image'>
        <img src={loginImage} alt='img.jpg'/>
      </div>
      <div className="login-container">
      <h2 className='login'>Welcome Back</h2>
      <form className='login-form' onSubmit={handleLogin}>
        <label className='email-label' htmlFor="email">Email:</label>
        <input
          className='login-email'
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className='password-label' htmlFor="password">Password:</label>
        <div className="password-input-container">
          <input
            className='login-password'
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="forgot-password">
          <Link className='custom-link' to="/forgot-password">Forgot Password?</Link>
        </div>
        {loginError && (
          <div className="login-error">
            <p>Either the email or password in incorrect. Please try again.</p>
          </div>
        )}

        <div className="create-account">
          <p>
            Don't have an account ? <Link className='custom-link' to="/register">Create a new account</Link>
          </p>
        </div>

        <button className='login-button' type="submit">Sign In</button>
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
