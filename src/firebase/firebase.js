import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc,setDoc,doc } from "firebase/firestore";
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    // Create user in authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const passwordHash = sha256(password);
    console.log('User cred:', userCredential);
    // Set the document name as the user's email
    const userDocRef = doc(firestore, "Users", email.toLowerCase());
    console.log('User doc ref:', userDocRef);
    // Save user data to Firestore with the document name as the user's email
    const userData = {
      name,
      email: email.toLowerCase(),
      password: passwordHash
    };
    console.log('User data:', userData);

    await setDoc(userDocRef, userData);
    console.log(userCredential.user);
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

export { registerWithEmailAndPassword, loginWithEmailAndPassword };
