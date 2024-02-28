import React, { useState } from "react";
import { auth } from "../firebase/firebase"; // Importing Firebase authentication
import './forgotpasswordpage.css'; // Importing CSS styles

function ForgotPasswordPage() {
    // State variables
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Function to handle password reset
    const handleResetPassword = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Attempt to send password reset email
            await auth.sendPasswordResetEmail(email);
            // Update state on success
            setMessage('Password reset email sent. Please check your email inbox.');
            setError('');
        } catch (error) {
            // Update state on error
            setError('Error sending reset email. Please check your email and try again.');
            setMessage('');
        }
    };

    // Component JSX
    return (
        <div className="forgot-password-page">
            <h2>Forgot Password</h2>
            <form onSubmit={handleResetPassword}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {/* Display success message if message state is not empty */}
            {message && <p className="success-message">{message}</p>}
            {/* Display error message if error state is not empty */}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default ForgotPasswordPage;
