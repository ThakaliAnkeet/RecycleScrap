import { useState, useEffect } from "react";
import { auth, firestore, storage } from "../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './editprofile.css';

function EditProfilePage() {
    const [user, setUser] = useState(auth.currentUser);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [profileImageExists, setProfileImageExists] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async(user) => {
            setUser(user);
            if (user) {
                await getUser();
            }
        });
        return () => unsubscribe();
    }, []);

    const getUser = async () => {
        const user = auth.currentUser;
        const userRef = doc(firestore, 'Users', user.email);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name || '');
            if (userData.profileImage) {
                setImageUrl(userData.profileImage);
                setProfileImageExists(true);
            }
        }
    }

    const handleChange = (e) => {
        if (e.target.files[0]) {
            const selectedImage = e.target.files[0];
            setImage(selectedImage);
            setImageUrl(URL.createObjectURL(selectedImage)); // Set the URL of the selected image
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return; // Ensure user is not null
        setLoading(true); // Set loading state to true

        const userRef = doc(firestore, 'Users', user.email);

        try {
            // Update name in Firestore
            await updateDoc(userRef, { name: name });

            // Upload image to Firebase Storage
            if (image) {
                const storageRef = ref(storage, `User_Image/${user.email}/${user.email}-image`);
                await uploadBytes(storageRef, image);
                const url = await getDownloadURL(storageRef);
                setImageUrl(url);

                // Save image URL to Firestore
                await updateDoc(userRef, { profileImage: url });
                setProfileImageExists(true);
            }
            navigate('/profile'); // Navigate to profile on success
        } catch (error) {
            console.error("Error updating profile:", error);
            // Handle error
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="edit-profile-button">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="edit-profile-button">Profile Image:</label>
                    <input
                        type="file"
                        onChange={handleChange}
                    />
                    {profileImageExists && imageUrl && (
                        <img src={imageUrl} alt="Profile" className="profile-image-preview" />
                    )}
                </div>
                <button className="save-button" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <Link className="custom-link" to="/profile">Cancel</Link>
            </form>
        </div>
    );
}

export default EditProfilePage;
