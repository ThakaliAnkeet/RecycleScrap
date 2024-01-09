import React, { useState } from 'react';
import Homepage from '../homepage/homepage';
import './navigationbar.css'

const NavBar = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
          <li className={activeTab === 'products' ? 'active' : ''} onClick={() => handleTabClick('products')}>
            Products
          </li>
          <li className={activeTab === 'contact' ? 'active' : ''} onClick={() => handleTabClick('contact')}>
            Contact
          </li>
        </ul>
      </nav>
      {activeTab === 'home' && <div>Home</div>}
      {activeTab === 'about' && <div>About Content</div>}
      {activeTab === 'products' && <div>Products Content</div>}
      {activeTab === 'contact' && <div>Contact Content</div>}
    </div>
  );
};

export default NavBar;
