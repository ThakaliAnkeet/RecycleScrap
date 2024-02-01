// ScrapDetailsPage.js
import React, { useEffect, useState } from 'react';
import './individualscrap.css'
import { useParams } from 'react-router-dom';
import { firestore, storage } from '../../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

function ScrapDetailsPage() {
  const { scrapId } = useParams();
  const [scrapDetails, setScrapDetails] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScrapDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(firestore, "ScrapsData", scrapId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setScrapDetails(data);

          // Fetch the image URL from Firebase Storage
          const imageRef = ref(storage, `Product_Image/Scraps/${data.email}/${data.imageName}`);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching scrap details:", error);
      }
      setLoading(false);
    };

    fetchScrapDetails();
  }, [scrapId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="scrap-details-page">
      <h1>{scrapDetails.itemTitle}</h1>
      {imageUrl && <img src={imageUrl} alt={scrapDetails.itemTitle} />}
      <p>{scrapDetails.itemDescription}</p>
      <p>Price: Rs. {scrapDetails.price}</p>
      <p>Seller: {scrapDetails.userName}</p>
      <p>Contact: {scrapDetails.phoneNumber}</p>
      <p>Email: {scrapDetails.email}</p>
      <p>Location: {scrapDetails.location}</p>
    </div>
  );
}

export default ScrapDetailsPage;