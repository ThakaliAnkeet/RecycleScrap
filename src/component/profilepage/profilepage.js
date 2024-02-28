import { useEffect, useState } from "react";
import { auth, firestore, changePassword } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import defaultImage from '../../assets/defaultimage.png';
import LoadingPage from "../loadingpage/loadingpage";
import ChangePasswordDialog from "./changepassword";
import './profilepage.css';

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

    const getUser = async () => {
        const userauth = auth.currentUser;
        if (userauth && userauth.email) {
            const userRef = doc(firestore, 'Users', userauth.email);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser(userData);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await getUser();
            }
        });
        return () => unsubscribe();
    }, []);

    const handlePasswordChange = async (currentPassword, newPassword) => {
        try {
            await changePassword(currentPassword, newPassword);
            setShowChangePasswordDialog(false);
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Error changing password: " + error.message);
        }
    };

    if (!user) {
        return <LoadingPage />;
    }

    const profileImage = user.profileImage ? user.profileImage : defaultImage;

    return (
        <div className="profile-page">
            <div className="profile-info">
                <img src={profileImage} alt="Profile" className="profile-image" />
                <h2>Welcome, {user.name}</h2>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <button onClick={() => setShowChangePasswordDialog(true)}>Change Password</button>
                <Link to="/edit-profile"><button>Edit Profile</button></Link>
            </div>
            {showChangePasswordDialog && (
                <ChangePasswordDialog
                    onClose={() => setShowChangePasswordDialog(false)}
                    onChangePassword={handlePasswordChange}
                />
            )}
        </div>
    );
}

export default ProfilePage;
