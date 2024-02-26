import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './registerpage.css';
import loginImage from '../assets/login.jpg';
import { registerWithEmailAndPassword } from '../firebase/firebase';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Password validation criteria
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!role) {
      setError('Please select a role');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match. Please make sure you have entered the same password in both fields');
    } else if (!password.match(passwordRegex)) {
      setError('Password must contain at least a capital letter, a number, and a special character and should be at least 8 characters long');
    } else {
      setError('');
      try {
        // Save user data including role to Firestore
        await registerWithEmailAndPassword(name, email.toLowerCase(), password, role);
        console.log('Registering with:', name, email, password, role);
        navigate('/login');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setError('The email address is already in use. Please use a different email.');
        } else {
          console.error('An error occurred during registration:', error.message);
        }
      }
    }
  };
  

  return (
    <div className='register-page'>
      <div className='register-image'>
        <img src={loginImage} alt='img.jpg' />
      </div>
      <div className="register-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Create a password"
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

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Scrap Seller">Scrap Seller</option>
            <option value="Artist">Artist</option>
            <option value="Both">Both</option>
          </select>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Sign Up</button>
          <p>
            Already have an account? <Link className='custom-link' to="/login">Login here</Link>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
