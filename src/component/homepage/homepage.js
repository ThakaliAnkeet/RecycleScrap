import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';
import { auth, firestore } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoadingPage from '../loadingpage/loadingpage';

function HomePage() {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await getUser();
      }
    });
    return () => unsubscribe();
  }, []);

  const getUser = async () => {
    const user = auth.currentUser;
    const userRef = doc(firestore, 'Users', user.email);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setRole(userData.role);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const actionButtons = [
    { role: ['Scrap Seller', 'Both'], link: '/buy-scrap', text: 'Buy Scrap' },
    { role: ['Scrap Seller', 'Both'], link: '/sell-scrap', text: 'Sell Scrap' },
    { role: ['Artist', 'Both'], link: '/sell-diy', text: 'Sell Creations' },
    { role: ['Artist', 'Both'], link: '/buy-diy', text: 'Buy Creation Items' }
  ];

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className='homepage-container'>
      <div className="home-page">
        <header>
          <h1 className='home-header'>Welcome Back!</h1>
          <p>Your go-to platform for buying and selling recycled materials</p>
        </header>

        <section className="quick-actions">
          {actionButtons.map((button, index) =>
            (button.role.includes(role) &&
              <Link key={index} to={button.link} className="action-button">
                {button.text}
              </Link>
            )
          )}
        </section>
      </div>
      <footer>
        <p>&copy; 2024 Recycle Scrap. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
