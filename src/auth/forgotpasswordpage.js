import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import './forgotpasswordpage.css';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await auth.sendPasswordResetEmail(email);
            setMessage('Password reset email sent. Please check your email inbox.');
            setError('');
        } catch (error) {
            setError('Error sending reset email. Please check your email and try again.');
            setMessage('');
        }
    };

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
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default ForgotPasswordPage;
