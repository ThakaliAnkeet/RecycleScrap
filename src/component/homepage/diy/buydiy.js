// BuyScrapPage.js

import React, { useEffect, useState } from 'react';
import './buydiy.css';
import { firestore, storage } from '../../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

function BuyDiyPage() {
  const [scrapList, setScrapList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScraps = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(firestore, "DIYData"));
          const scrapsDataPromises = querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            if (data.email && data.imageName) {
              const imageRef = ref(storage, `Product_Image/DIY/${data.email}/${data.imageName}`);
              try {
                const imageUrl = await getDownloadURL(imageRef);
                return { id: doc.id, imageUrl, ...data };
              } catch (imageError) {
                console.error("Error fetching image:", imageError);
                return { id: doc.id, imageUrl: '/path/to/default/image.png', ...data }; // Provide a default image path
              }
            } else {
              console.error("Missing fields in document:", doc.id);
              return { id: doc.id, imageUrl: '/path/to/default/image.png', ...data }; // Provide a default image path
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
    return <div className="diy-loading">Loading...</div>;
  }

  return (
    <div className="diy-container">
    <h1 className="diy-header">Buy Scrap</h1>
    <div className="diy-grid">
      {scrapList.map((scrap) => (
        <div key={scrap.id} className="diy-card">
          <div className="diy-image-container">
            <img src={scrap.imageUrl} alt={scrap.itemTitle} className="scrap-image" />
          </div>
          <div className="diy-info">
            <h2 className="diy-title">{scrap.itemTitle}</h2>
            <p className="diy-description">{scrap.itemDescription}</p>
            <div className="diy-details">
              <p className="diy-user">{scrap.userName}</p>
              <p className="diy-contact">{scrap.phoneNumber}</p>
              <p className="diy-email">{scrap.email}</p>
              <p className="diy-location">{scrap.location}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default BuyDiyPage;