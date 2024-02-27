import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation
import './sidebar.css';
const SidebarPageButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div>
      <button className="menu-button" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>
      {isOpen && (
        <div className="sidebar">
          <ul>
            <Link className='custom-link' to="/home">
            <li>
              Home
            </li>
            </Link>

            <Link to="/community">
            <li>
              Community
            </li>
            </Link> 

            <Link to="/order">
            <li>
              Order
            </li>
            </Link>
            
            <Link to="/cart">
            <li>
              Cart
            </li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SidebarPageButton;
