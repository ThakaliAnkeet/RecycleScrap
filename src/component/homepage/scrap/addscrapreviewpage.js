// AddReviewPage.js
import React, { useState } from 'react';
import './addReviewPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, auth } from '../../../firebase/firebase';
import { doc, updateDoc,getDoc } from 'firebase/firestore';

function AddReviewPage() {
  const { scrapId } = useParams();
  const navigate = useNavigate(); // Using useNavigate instead of useHistory
  const [rating, setRating] = useState(0); // 0 initially, as no rating is given
  const [review, setReview] = useState('');

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleAddReview = async () => {
    try {
      const user = auth.currentUser;
      const userEmail = user ? user.email : 'unknown';
      const formattedReview = `${userEmail}-${rating}-${review}`;
      const scrapDocRef = doc(firestore, 'ScrapsData', scrapId);

      // Fetch current scrap details to get the existing reviews
      const scrapSnap = await getDoc(scrapDocRef);
      if (scrapSnap.exists()) {
        const currentScrapDetails = scrapSnap.data();
        const updatedReviews = [
          ...currentScrapDetails.ratingAndReview,
          formattedReview,
        ];

        // Update the Firestore document with the new review
        await updateDoc(scrapDocRef, {
          ratingAndReview: updatedReviews,
        });

        // Redirect back to the scrap details page
        navigate(`/scrap/${scrapId}`);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
};

  return (
    <div className="add-review-page">
      <h1>Add Review</h1>
      <div className="rating-container">
        <p>Select your rating:</p>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} onClick={() => handleRatingClick(star)}>
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
      <div className="review-container">
        <p>Add your review:</p>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      </div>
      <button className='add-review' onClick={handleAddReview}>Add Review</button>
    </div>
  );
}

export default AddReviewPage;
