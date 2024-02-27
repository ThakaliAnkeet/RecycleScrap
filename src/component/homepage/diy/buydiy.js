// BuydiyPage.js

import React, { useEffect, useState } from 'react';
import './buydiy.css';
import { firestore, storage } from '../../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../loadingpage/loadingpage';

function BuyDiyPage() {
  const [diyList, setdiyList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate=useNavigate();
  const handleCardClick = (diyId) => {
    navigate(`/diy/${diyId}`);
  };
  useEffect(() => {
    const fetchdiys = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(firestore, "DIYData"));
          const diysDataPromises = querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            if (data.email && data.imageName) {
              const imageRef = ref(storage, `Product_Image/DIY/${data.email}/${data.imageName}`);
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
          const diysData = await Promise.all(diysDataPromises);
          setdiyList(diysData);
        } catch (error) {
          console.error("Error fetching diys:", error);
        }
        setLoading(false);
      };

    fetchdiys();
  }, []);

  if (loading) {
    return <LoadingPage/>;
  }

  return (
    <div className="diy-container">
    <h1 className="diy-header">Buy Creations</h1>
    <div className="diy-grid">
      {diyList.map((diy) => (
        <div key={diy.id} className="diy-card" onClick={() => handleCardClick(diy.id)}>
          <div className="diy-image-container">
            <img src={diy.imageUrl} alt={diy.itemTitle} className="diy-image" />
          </div>
          <div className="diy-info">
            <h2 className="diy-title">{diy.itemTitle}</h2>
            <p className="diy-description">{diy.itemDescription}</p>
            <p className="diy-price">Rs. {diy.price}</p>
            <div className="diy-details">
              <p className="diy-user">{diy.userName}</p>
              <p className="diy-contact">{diy.phoneNumber}</p>
              <p className="diy-email">{diy.email}</p>
              <p className="diy-location">{diy.location}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default BuyDiyPage;