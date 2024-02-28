import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import './changepassword.css'

function ChangePasswordDialog({ onClose, onChangePassword }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const handleChangePassword = () => {
        if (newPassword !== confirmNewPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
        onChangePassword(currentPassword, newPassword);
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <h2>Change Password</h2>
                <label>
                    Current Password:
                    <div className="password-input">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <span className="password-toggle" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </label>
                <label>
                    New Password:
                    <div className="password-input">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </label>
                <label>
                    Confirm New Password:
                    <div className="password-input">
                        <input
                            type={showConfirmNewPassword ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <span className="password-toggle" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </label>
                <div className="button-group">
                    <button onClick={handleChangePassword}>Change Password</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordDialog;
