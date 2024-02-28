import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc,setDoc,doc } from "firebase/firestore";
import {getStorage} from 'firebase/storage'
import { sha256 } from "js-sha256";

const firebaseConfig = {
  apiKey: "AIzaSyCH020qSZHUpGXBpUzva1C225h9czubiFQ",
  authDomain: "recycle-scrap.firebaseapp.com",
  projectId: "recycle-scrap",
  storageBucket: "recycle-scrap.appspot.com",
  messagingSenderId: "211209599456",
  appId: "1:211209599456:web:9e50fb12cdf1dce95e1385",
  measurementId: "G-7E3JBF5BH1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

const registerWithEmailAndPassword = async (name, email, password,role) => {
  try {
    // Create user in authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const passwordHash = sha256(password);
    // Set the document name as the user's email
    const userDocRef = doc(firestore, "Users", email.toLowerCase());
    // Save user data to Firestore with the document name as the user's email
    const userData = {
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      role:role
    };

    await setDoc(userDocRef, userData);
    return userCredential.user;
  } catch (error) {
    // Handle errors
    console.error("Error registering user:", error);
    throw error;
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Additional logic if needed
    return userCredential.user;
  } catch (error) {
    // Handle errors
    console.error("Error logging in:", error);
    throw error;
  }
};
const changePassword = async (currentPassword, newPassword) => {
  try {
      const user = auth.currentUser;
      if (!user) {
          throw new Error('User is not authenticated.');
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      // Update password
      await updatePassword(user, newPassword);
      console.log("Password changed successfully!");
      return true;
  } catch (error) {
      console.error("Error changing password:", error);
      throw error;
  }
};



export { storage, auth, firestore, registerWithEmailAndPassword, loginWithEmailAndPassword, changePassword };
