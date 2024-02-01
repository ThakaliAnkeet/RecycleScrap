// diyDetailsPage.js
import React, { useEffect, useState } from 'react';
import './individualdiy.css'
import { useParams } from 'react-router-dom';
import { firestore, storage } from '../../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

function DiyDetailsPage() {
  const { diyId } = useParams();
  const [diyDetails, setdiyDetails] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdiyDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(firestore, "DIYData", diyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setdiyDetails(data);

          // Fetch the image URL from Firebase Storage
          const imageRef = ref(storage, `Product_Image/DIY/${data.email}/${data.imageName}`);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching diy details:", error);
      }
      setLoading(false);
    };

    fetchdiyDetails();
  }, [diyId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="diy-details-page">
      <h1>{diyDetails.itemTitle}</h1>
      {imageUrl && <img src={imageUrl} alt={diyDetails.itemTitle} />}
      <p>{diyDetails.itemDescription}</p>
      <p>Price: Rs. {diyDetails.price}</p>
      <p>Seller: {diyDetails.userName}</p>
      <p>Contact: {diyDetails.phoneNumber}</p>
      <p>Email: {diyDetails.email}</p>
      <p>Location: {diyDetails.location}</p>
    </div>
  );
}

export default DiyDetailsPage;