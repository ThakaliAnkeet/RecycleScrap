// HomePage.js

import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router
import './homepage.css';

function HomePage() {
  return (
    <div className='homepage-container'>
    <div className="home-page">
      <header>
        <h1>Welcome Back!</h1>
        <p>Your go-to platform for buying and selling recycled materials</p>
      </header>

      <section className="quick-actions">
        <Link to="/buy-scrap" className="action-button">
          Buy Scrap
        </Link>
        <Link to="/sell-creations" className="action-button">
          Sell Creations
        </Link>
        <Link to="/explore-creators" className="action-button">
          Explore DIY Creators
        </Link>
      </section>

      <section className="recent-activity">
        <h2>Recent Activity</h2>
        {/* Display recent activity feed or summary here */}
      </section>

      <section className="personal-recommendations">
        <h2>Personal Recommendations</h2>
        {/* Display personalized recommendations based on user preferences */}
      </section>

      <section className="community-highlights">
        <h2>Community Highlights</h2>
        {/* Showcase featured DIY creators or highlight community events */}
      </section>

      <section className="educational-content">
        <h2>Educational Content</h2>
        {/* Provide tips, guides, or educational content related to recycling and sustainability */}
      </section>

    </div>
      <footer>
        <p>&copy; 2024 Recycle Scrap. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
