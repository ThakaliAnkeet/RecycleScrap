import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import RegisterPage from './auth/registerpage';
import LoginPage from './auth/loginpage';
import NavBar from './component/navigationbar/navigationbar';
import LandingPage from './component/landingpage/landingpage';
import SellScrapPage from './component/homepage/scrap/sellscrap';
import SellDIYPage from './component/homepage/diy/selldiy';
import BuyScrapPage from './component/homepage/scrap/buyscrap';
import BuyDiyPage from './component/homepage/diy/buydiy';
import ScrapDetailsPage from './component/homepage/scrap/individualscrap';
import DiyDetailsPage from './component/homepage/diy/individualdiy';
import AddScrapReviewPage from './component/homepage/scrap/addscrapreviewpage';
import AddDiyReviewPage from './component/homepage/diy/addDiyReviewpage';
import AddToCartPage from './component/homepage/addToCart/addToCart';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<NavBar />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sell-scrap" element={<SellScrapPage />} />
        <Route path="/sell-diy" element={<SellDIYPage />} />
        <Route path="/buy-scrap" element={<BuyScrapPage />} />
        <Route path="/buy-diy" element={<BuyDiyPage />} />
        <Route path="/scrap/:scrapId" element={<ScrapDetailsPage />} />
        <Route path="/diy/:diyId" element={<DiyDetailsPage />} />
        <Route path='/add-scrap-review/:scrapId' element={<AddScrapReviewPage />} />
        <Route path='/add-diy-review/:diyId' element={<AddDiyReviewPage />} />
        <Route path='/cart' element={<AddToCartPage />} />

      </Routes>
    </BrowserRouter>
  );
};

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
