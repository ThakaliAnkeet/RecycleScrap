// LandingPage.js

import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router
import './landingpage.css';

function LandingPage() {
  return (
    <div className='landing-container'>
    <div className="landing-page">
      <header>
        <h1>Recycle Scrap</h1>
        <p>Your go-to platform for buying and selling recycled materials</p>
      </header>

      <section className="features">
        <div className="feature">
          <h2>Buy Scrap Items</h2>
          <p>Discover a variety of recycled materials and buy from other users.</p>
        </div>

        <div className="feature">
          <h2>Sell Your Creations</h2>
          <p>Are you a DIY creator? Sell your recycled creations on our platform.</p>
        </div>

        <div className="feature">
          <h2>Eco-Friendly</h2>
          <p>Help save the environment by participating in the recycling community.</p>
        </div>
      </section>

      <section className="creator-section">
        <h2>DIY Creators</h2>
        <p>Turn your recycled purchases into unique creations and sell them on our platform.</p>
      </section>

      <section className="register-section">
        <h2>Join Us Today!</h2>
        <p>Ready to get started? <Link className='custom-link' to="/register">Register Now</Link></p>
      </section>

    </div>
      <footer>
        <p>&copy; 2024 Recycle Scrap. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
