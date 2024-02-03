// SellDIYPage.js
import React, { useState } from 'react';
import './selldiy.css';
import { doc, setDoc } from 'firebase/firestore';
import {storage,auth,firestore} from '../../../firebase/firebase';
import {ref,uploadBytes } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

function SellDIYPage() {
  const [itemImage, setItemImage] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [location, setLocation] = useState('');
  const [price,setPrice]=useState('');
  const [error, setError] = useState('');

  const navigate=useNavigate();
  const generateRandomName = () => {
    // Use the current date and time in milliseconds as the random name
    const currentDate = new Date();
    const randomName = currentDate.getTime().toString();
    return randomName;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemImage) {
        setError('Please select an image.');
        return;
      }
      if (!itemTitle) {
        setError('Please enter the item title.');
        return;
      }
      if (!itemDescription) {
        setError('Please enter the item description.');
        return;
      }
      if (!userName) {
        setError('Please enter your name.');
        return;
      }
      if (!phoneNumber) {
        setError('Please enter your phone number.');
        return;
      }
      if (!emailAddress) {
        setError('Please enter your email address.');
        return;
      }
      if (!location) {
        setError('Please enter the location.');
        return;
      }
      if (!price) {
        setError('Please enter the price.');
        return;
      }
    try {
      const user = auth.currentUser;
      const userEmail = user ? user.email : 'unknown';
      console.log(userEmail);
      setError('');

      // Ensure that itemImage is not empty before attempting to upload
      if (itemImage) {
        // Extract the file extension from the original file name
        const fileExtension = itemImage.name.split('.').pop();
  
        // Generate a random name for the image using current date and time
        const randomName = generateRandomName();
        const imageName=`${randomName}.${fileExtension}`;

        // Reference to the Firebase Storage path with the file extension
        const storageRef = ref(storage, `Product_Image/DIY/${emailAddress.toLowerCase()}/${randomName}.${fileExtension}`);
        console.log(storageRef);
  
        // Use put method to upload the itemImage to the storageRef
        const snapshot = await uploadBytes(storageRef, itemImage);
        // console.log('Image uploaded successfully:', snapshot);
        const scrapDocRef=doc(firestore,"DIYData",randomName);
        const scrapData={
          itemTitle,
          itemDescription,
          userName,
          phoneNumber,
          email:emailAddress.toLowerCase(),
          location,
          imageName,
          price,
          ratingAndReview: [],
        };
        await setDoc(scrapDocRef, scrapData);

        console.log('diydata',scrapData);
        console.log('diyref',scrapDocRef);
        navigate('/home')
      } else {
        console.error('Please select an image before submitting.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Error submitting form. Please try again.');

    }
  };
  
  
  return (
    <div className="sell-diy-container">
      <h1>Sell Your Creations</h1>
      <form className="sell-diy-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Item Image:
          <input
            type="file"
            className="form-input"
            onChange={(e) => setItemImage(e.target.files[0])}
            />
        </label>
        <label className="form-label">
          Item Title:
          <input
            type="text"
            className="form-input"
            value={itemTitle}
            onChange={(e) => setItemTitle(e.target.value)}
          />
        </label>
        <label className="form-label">
          Item Description:
          <textarea
            className="form-input"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
        </label>
        <label className="form-label">
          Price:
          <input
            type="num"
            className="form-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label className="form-label">
          Your Name:
          <input
            type="text"
            className="form-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label className="form-label">
          Phone Number:
          <input
            type="tel"
            className="form-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
        <label className="form-label">
          Email Address:
          <input
            type="email"
            className="form-input"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </label>
        <label className="form-label">
          Location:
          <input
            type="text"
            className="form-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="form-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SellDIYPage;
