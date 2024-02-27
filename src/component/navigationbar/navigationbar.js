import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import HomePage from '../homepage/homepage';
import AboutPage from '../aboutpage/aboutpage';
// import CartPage from '../Cartpage/Cartpage';
import './navigationbar.css';
import AddToCartPage from '../homepage/addToCart/addToCart';
import CommunityPage from '../homepage/communityPage/communitypage';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import OrdersPage from '../homepage/addToCart/order';
import defaultImage from '../../assets/defaultimage.png';

const NavBar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [profileImageExists, setProfileImageExists] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async(user) => {
        setUser(user);
        if (user) {
            await getUser();
        }
    });
    return () => unsubscribe();
}, []);
  const getUser = async () => {
    const user = auth.currentUser;
    const userRef = doc(firestore, 'Users', user.email);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.profileImage) {
            setImageUrl(userData.profileImage);
            setProfileImageExists(true);
        }
    }
}

const handleTabClick = (tab) => {
  setActiveTab(tab);
  setIsMenuOpen(false);

  switch (tab) {
    case 'account-settings':
      navigate('/edit-profile');
      break;
    case 'profile':
      navigate('/profile');
      break;
    default:
      break;
  }
};

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    navigate('/login');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'community':
        return <CommunityPage />;
      case 'cart':
        return <AddToCartPage />;
      case 'order':
        return <OrdersPage/>;
      default:
        return null;
    }
  };

  return (
    <div className='navigation-container'>
      <nav className='navigation'>
        <ul>
          <li className={activeTab === 'home' ? 'active' : ''} onClick={() => handleTabClick('home')}>
            Home
          </li>
          <li className={activeTab === 'about' ? 'active' : ''} onClick={() => handleTabClick('about')}>
            About
          </li>
          <li className={activeTab === 'community' ? 'active' : ''} onClick={() => handleTabClick('community')}>
            Community
          </li>
          <li className={activeTab === 'cart' ? 'active' : ''} onClick={() => handleTabClick('cart')}>
            Cart
          </li>
          <li className={activeTab === 'order' ? 'active' : ''} onClick={() => handleTabClick('order')}>
            Orders
          </li>
        </ul>
        <div className='avatar-container' onClick={handleMenuToggle}>
          {profileImageExists ? (
            <img src={imageUrl} alt="Profile" className="avatar" />
          ) : (
            <img src={defaultImage} alt="Prof" className="avatar" />
          )}
        </div>
        {isMenuOpen && (
          <div className='menu-dialog'>
            <ul>
              <li onClick={() => handleTabClick('account-settings')}>Account Settings</li>
              <li onClick={() => handleTabClick('profile')}>Profile</li>
              <li onClick={() => handleLogout()}>Logout</li>
            </ul>
          </div>
        )}
      </nav>
      {renderPage()}
    </div>
  );
};

export default NavBar;
