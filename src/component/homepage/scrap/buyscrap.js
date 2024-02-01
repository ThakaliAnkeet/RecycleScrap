// BuyScrapPage.js

import React, { useEffect, useState } from 'react';
import './buyscrap.css';
import { firestore, storage } from '../../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

function BuyScrapPage() {
  const [scrapList, setScrapList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate=useNavigate();

  const handleCardClick = (scrapId) => {
    navigate(`/scrap/${scrapId}`);
  };
  useEffect(() => {
    const fetchScraps = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(firestore, "ScrapsData"));
          const scrapsDataPromises = querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            if (data.email && data.imageName) {
              const imageRef = ref(storage, `Product_Image/Scraps/${data.email}/${data.imageName}`);
              try {
                const imageUrl = await getDownloadURL(imageRef);
                return { id: doc.id, imageUrl, ...data };
              } catch (imageError) {
                console.error("Error fetching image:", imageError);
                return { id: doc.id, imageUrl: '/path/to/default/image.png', ...data }; 
              }
            } else {
              console.error("Missing fields in document:", doc.id);
              return { id: doc.id, imageUrl: '/path/to/default/image.png', ...data }; 
            }
          });
          const scrapsData = await Promise.all(scrapsDataPromises);
          setScrapList(scrapsData);
        } catch (error) {
          console.error("Error fetching scraps:", error);
        }
        setLoading(false);
      };

    fetchScraps();
  }, []);

  if (loading) {
    return <div className="scrap-loading">Loading...</div>;
  }

  return (
    <div className="scrap-container">
    <h1 className="scrap-header">Buy Scrap</h1>
    <div className="scrap-grid">
      {scrapList.map((scrap) => (
        <div key={scrap.id} className="scrap-card" onClick={() => handleCardClick(scrap.id)}>
          <div className="scrap-image-container">
            <img src={scrap.imageUrl} alt={scrap.itemTitle} className="scrap-image" />
          </div>
          <div className="scrap-info">
            <h2 className="scrap-title">{scrap.itemTitle}</h2>
            <p className="scrap-description">{scrap.itemDescription}</p>
            <p className="scrap-price">Rs. {scrap.price}</p>
            <div className="scrap-details">
              <p className="scrap-user">{scrap.userName}</p>
              <p className="scrap-contact">{scrap.phoneNumber}</p>
              <p className="scrap-email">{scrap.email}</p>
              <p className="scrap-location">{scrap.location}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default BuyScrapPage;