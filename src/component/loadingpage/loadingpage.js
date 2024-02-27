import React from 'react';
import './loadingpage.css';
import loadingLogo from '../../assets/logo.png'

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <img src={loadingLogo} alt="Loading..." className="spinner" />
    </div>
  );
}

export default LoadingPage;
