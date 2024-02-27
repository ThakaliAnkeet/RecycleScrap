import { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase/firebase";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import './profilepage.css'
import { doc, getDoc } from "firebase/firestore";

function ProfilePage(){
    const [user, setUser] = useState(null);

    const getUser = async () => {
        const userauth = auth.currentUser;
        if (userauth && userauth.email) {
            console.log(userauth.email)
            const userRef = doc(firestore, 'Users', userauth.email);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData=userDoc.data();
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

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-info">
                <img src={user.profileImage} alt="Profile" className="profile-image" />
                <h2>Welcome, {user.name}</h2>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <Link to="/edit-profile"><button>Edit Profile</button></Link>
            </div>
        </div>
    );
}

export default ProfilePage;
