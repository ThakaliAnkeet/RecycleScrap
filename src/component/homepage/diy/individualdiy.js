// diyDetailsPage.js
import React, { useEffect, useState } from 'react';
import './individualdiy.css'
import { useParams,useNavigate } from 'react-router-dom';
import { firestore, storage,auth } from '../../../firebase/firebase';
import { doc, getDoc,setDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import SidebarPageButton from '../../navigationbar/sidebar';
import LoadingPage from '../../loadingpage/loadingpage';
function DiyDetailsPage() {
  const { diyId } = useParams();
  const navigate = useNavigate();
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
  const addToCart = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        // Handle case where user is not logged in
        return;
      }
      
      const userEmail = user.email;
      const cartItemDocRef = doc(firestore, 'UserCarts', `${userEmail}-${diyId}`);
      await setDoc(cartItemDocRef, { ...diyDetails, userEmail }); // Include userEmail in the document
      console.log('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  const calculateAverageRating = () => {
    if (!diyDetails.ratingAndReview || diyDetails.ratingAndReview.length === 0) {
      return 0;
    }

    const totalRating = diyDetails.ratingAndReview.reduce((sum, review) => {
      return sum + parseInt(review.split('-')[1], 10);
    }, 0);

    return Math.round(totalRating / diyDetails.ratingAndReview.length);
  };

  const renderStarRating = (rating) => {
    const filledStars = Array.from({ length: rating }, (_, index) => (
      <span key={index}>&#9733;</span> // Filled star
    ));
    const emptyStars = Array.from({ length: 5 - rating }, (_, index) => (
      <span key={index}>&#9734;</span> // Empty star
    ));

    return [...filledStars, ...emptyStars];
  };

  const handleAddReviewClick = () => {
    navigate(`/add-diy-review/${diyId}`);
  };
  if (loading) {
    return <LoadingPage/>;
  }
  if (!diyDetails || Object.keys(diyDetails).length === 0) {
    return <div>Error: diy details not found</div>;
  }

  return (
    <div className="diy-details-page">
      <SidebarPageButton/>
      <div className='individual-diy-image'>
        {imageUrl ? (
          <img src={imageUrl} alt={diyDetails.itemTitle} />
        ) : (
          <p>No Image Available</p>
        )}
      </div>

      <div className='diy-details-review'>
        <div className='diy-details'>
          <h1>{diyDetails.itemTitle}</h1>
          <p>{diyDetails.itemDescription}</p>
          <p>Price: Rs. {diyDetails.price}</p>
          <p>Seller: {diyDetails.userName}</p>
          <p>Contact: {diyDetails.phoneNumber}</p>
          <p>Email: {diyDetails.email}</p>
          <p>Location: {diyDetails.location}</p>
          <button className="add-to-cart-button" onClick={addToCart}>
        Add to Cart
      </button>
        </div>
        <div className='rating-and-review'>
          <h2>Rating and Reviews</h2>
          <p>Average Rating: {renderStarRating(calculateAverageRating())}</p>
          {diyDetails.ratingAndReview && diyDetails.ratingAndReview.length > 0 ? (
            <div>
              <ul className='rating-and-review-list'>
                {diyDetails.ratingAndReview.map((review, index) => {
                  const [user, rating, reviewText] = review.split('-');
                  return (
                    <li key={index} className='rating-and-review-item'>
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
    </div>
  );
}

export default DiyDetailsPage;