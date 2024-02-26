// ScrapDetailsPage.js
import React, { useEffect, useState } from 'react';
import './individualscrap.css';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, storage,auth } from '../../../firebase/firebase';
import { doc, getDoc,setDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

function ScrapDetailsPage() {
  const { scrapId } = useParams();
  const navigate = useNavigate();
  const [scrapDetails, setScrapDetails] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScrapDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(firestore, 'ScrapsData', scrapId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setScrapDetails(data);
          const imageRef = ref(storage, `Product_Image/Scraps/${data.email}/${data.imageName}`);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
          console.log('indicidual',url)
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching scrap details:', error);
      }
      setLoading(false);
    };

    fetchScrapDetails();
    console.log(scrapDetails);
    const user = auth.currentUser;
      const userEmail = user ? user.email : 'unknown';
      console.log(userEmail);
  }, [scrapId]);

  const calculateAverageRating = () => {
    if (!scrapDetails.ratingAndReview || scrapDetails.ratingAndReview.length === 0) {
      return 0;
    }

    const totalRating = scrapDetails.ratingAndReview.reduce((sum, review) => {
      return sum + parseInt(review.split('-')[1], 10);
    }, 0);

    return Math.round(totalRating / scrapDetails.ratingAndReview.length);
  };

  const renderStarRating = (rating) => {
    const filledStars = Array.from({ length: rating }, (_, index) => (
      <span key={`filled-${index}`}>&#9733;</span> // Unique key for filled stars
    ));
    const emptyStars = Array.from({ length: 5 - rating }, (_, index) => (
      <span key={`empty-${index}`}>&#9734;</span> // Unique key for empty stars
    ));

    return [...filledStars, ...emptyStars];
  };

  const handleAddReviewClick = () => {
    navigate(`/add-scrap-review/${scrapId}`);
  };
  const addToCart = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        // Handle case where user is not logged in
        return;
      }
      
      const userEmail = user.email;
      const cartItemDocRef = doc(firestore, 'UserCarts', `${userEmail}-${scrapId}`);
      await setDoc(cartItemDocRef, { ...scrapDetails, userEmail }); // Include userEmail in the document
      console.log('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!scrapDetails || Object.keys(scrapDetails).length === 0) {
    return <div>Error: Scrap details not found</div>;
  }

  return (
    <div className="scrap-details-page">
      <div className='individual-scrap-image'>
        {imageUrl ? (
          <img src={imageUrl} alt={scrapDetails.itemTitle} />
        ) : (
          <p>No Image Available</p>
        )}
        <div className='scrap-details'>
          <h1>{scrapDetails.itemTitle}</h1>
          <p>{scrapDetails.itemDescription}</p>
          <p>Price: Rs. {scrapDetails.price}</p>
          <p>Seller: {scrapDetails.userName}</p>
          <p>Contact: {scrapDetails.phoneNumber}</p>
          <p>Email: {scrapDetails.email}</p>
          <p>Location: {scrapDetails.location}</p>
        <button className="add-to-cart-button" onClick={addToCart}>
        Add to Cart
      </button>
        </div>
      </div>
      <div className='rating-and-review'>
        <h2>Rating and Reviews</h2>
        <p>Average Rating: {renderStarRating(calculateAverageRating())}</p>
        {scrapDetails.ratingAndReview && scrapDetails.ratingAndReview.length > 0 ? (
          <div>
            <ul className='rating-and-review-list'>
              {scrapDetails.ratingAndReview.map((review, index) => {
                const [user, rating, reviewText] = review.split('-');
                return (
                  <li key={`review-${index}`} className='rating-and-review-item'> {/* Unique key for each review */}
                    <p>User: {user}</p>
                    <p>Rating: {renderStarRating(parseInt(rating, 10))}</p>
                    <p>Review: {reviewText}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className='no-ratings'>No ratings and reviews yet.</p>
        )}
        <button className="add-review-button" onClick={handleAddReviewClick}>
          Add Review and Rating
        </button>
      </div>
    </div>
  );
}

export default ScrapDetailsPage;
