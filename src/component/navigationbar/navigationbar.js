// NavBar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import HomePage from '../homepage/homepage';
import AboutPage from '../aboutpage/aboutpage';
import ProductsPage from '../productpage/productpage';
// import CartPage from '../Cartpage/Cartpage';
import './navigationbar.css';
import AddToCartPage from '../homepage/addToCart/addToCart';
import CommunityPage from '../homepage/communityPage/communitypage';

const NavBar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false); // Close the menu when a tab is clicked
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
        </ul>
        <div className='avatar-container' onClick={handleMenuToggle}>
          <div className='avatar'></div>
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
