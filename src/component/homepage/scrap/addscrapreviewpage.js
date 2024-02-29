import React, { useState } from 'react';
import './addReviewPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, auth } from '../../../firebase/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function AddScrapReviewPage() {
  const { scrapId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleAddReview = async () => {
    try {
      if (rating === 0 || review.trim() === '') {
        setError('Please provide both a rating and a review.');
        return;
      }

      const user = auth.currentUser;
      const userEmail = user ? user.email : 'unknown';
      const formattedReview = `${userEmail}-${rating}-${review}`;
      const scrapDocRef = doc(firestore, 'ScrapsData', scrapId);

      const scrapSnap = await getDoc(scrapDocRef);
      if (scrapSnap.exists()) {
        const currentScrapDetails = scrapSnap.data();
        let updatedReviews = [];

        if (currentScrapDetails.ratingAndReview && Array.isArray(currentScrapDetails.ratingAndReview)) {
          updatedReviews = [
            ...currentScrapDetails.ratingAndReview,
            formattedReview,
          ];
        } else {
          updatedReviews = [formattedReview];
        }

        await updateDoc(scrapDocRef, {
          ratingAndReview: updatedReviews,
        });

        navigate(`/scrap/${scrapId}`);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <div className="add-review-page">
      <h1>Add Review</h1>
      {error && <p className="error-message">{error}</p>}
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

export default AddScrapReviewPage;
