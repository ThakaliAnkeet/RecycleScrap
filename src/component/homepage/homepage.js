import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';
import { auth, firestore } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

function HomePage() {
  const [role, setRole] = useState('');

  const getUser = async () => {
    const user = auth.currentUser;
    const userRef = doc(firestore, 'Users', user.email);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setRole(userData.role);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await getUser();
      }
    });
    return () => unsubscribe();
  }, [role]);


  return (
    <div className='homepage-container'>
      <div className="home-page">
        <header>
          <h1 className='home-header'>Welcome Back!</h1>
          <p>Your go-to platform for buying and selling recycled materials</p>
        </header>

        <section className="quick-actions">
          {role === 'Scrap Seller' || role === 'Both' ? (
            <>
              <Link to="/buy-scrap" className="action-button">
                Buy Scrap
              </Link>
              <Link to="/sell-scrap" className="action-button">
                Sell Scrap
              </Link>
            </>
          ) : null}

          {role === 'Artist' || role === 'Both' ? (
            <>
              <Link to="/sell-diy" className="action-button">
                Sell Creations
              </Link>
              <Link to="/buy-diy" className="action-button">
                Explore DIY Creations
              </Link>
            </>
          ) : null}
        </section>
      </div>
      <footer>
        <p>&copy; 2024 Recycle Scrap. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
