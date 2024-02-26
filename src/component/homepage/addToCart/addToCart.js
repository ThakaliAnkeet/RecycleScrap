import React, { useEffect, useState } from 'react';
import './addToCart.css';
import { firestore, auth, storage } from '../../../firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc,getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import axios from 'axios';
function AddToCartPage() {
  const [customer,setCustomer]=useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [checkoutPayload,setCheckoutPayload]=useState('');

  const handleCheckout = async () => {
    // Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    try {
      // Fetch user details from Firestore based on email
      const userRef = doc(firestore, 'Users', customer.email);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const payload = {
          return_url: 'http://localhost:3000/home',
          website_url:'http://localhost:3000/cart',
          amount: totalAmount*100,
          purchase_order_id: "test12",
          purchase_order_name: "test",
          customer_info: {
            name: userData.name,
            email: customer.email,
            phone: "9844344807"
          },          
        };
        setCheckoutPayload(payload);
        // Make an HTTP POST request to your server
        const response = await axios.post('https://recyclescrap.onrender.com/khalti-api', checkoutPayload);
        if(response){
          window.location.href=`${response?.data?.data?.payment_url}`
        }
      } else {
        console.error('User document not found for email:', customer.email);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
  
  
  

  const handlePaymentOptionSelect = (option) => {
    setSelectedPaymentOption(option);
    setShowDialog(false);
    // You can implement further actions based on the selected option
  };

  const initializeCartItems = (items) => {
    const initializedItems = items.map((item) => ({
      ...item,
      quantity: 1, // You can set it to whatever initial quantity you prefer
    }));
    return initializedItems;
  };

  const decreaseQuantity = (item) => {
    const updatedItems = cartItems.map((cartItem) => {
      if (cartItem.id === item.id && cartItem.quantity > 1) {
        return { ...cartItem, quantity: parseInt(cartItem.quantity, 10) - 1 };
      }
      return cartItem;
    });
    setCartItems(updatedItems);
  };

  const increaseQuantity = (item) => {
    const updatedItems = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, quantity: parseInt(cartItem.quantity, 10) + 1 };
      }
      return cartItem;
    });
    setCartItems(updatedItems);
  };

  const removeItem = async (itemId) => {
    try {
      // Remove item from Firestore
      await deleteDoc(doc(firestore, 'UserCarts', itemId));
      // Remove item from UI
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCustomer(user);
        try {
          const userEmail = user.email;
          const q = query(collection(firestore, 'UserCarts'), where('userEmail', '==', userEmail));
          const querySnapshot = await getDocs(q);
      
          const items = await Promise.all(querySnapshot.docs.map(async (doc) => {
              const data = doc.data();
              const imagePaths = [
                  `Product_Image/Scraps/${data.email}/${data.imageName}`,
                  `Product_Image/DIY/${data.email}/${data.imageName}`
              ];
              let imageUrl;
              for (const path of imagePaths) {
                  const imageRef = ref(storage, path);
                  try {
                      imageUrl = await getDownloadURL(imageRef);
                      // If the image is found, break the loop
                      break;
                  } catch (error) {
                      // If image not found at this path, continue to next path
                      continue;
                  }
              }
      
              return { id: doc.id, ...data, imageUrl };
          }));

          const initializedItems = initializeCartItems(items); // Initialize items with quantity property
          setCartItems(initializedItems);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching cart items:', error);
          setLoading(false);
        }
      } else {
        setCartItems([]);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate total amount
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="add-to-cart-page">
      <h1 className="page-title">Cart Items</h1>
      <div className="cart-items-container">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            {item.imageUrl ? (
              <img className="item-image" src={item.imageUrl} alt={item.itemTitle} />
            ) : (
              <p className="no-image">No Image Available</p>
            )}
            <h2 className="item-title">{item.itemTitle}</h2>
            {/* <p className="item-description">{item.itemDescription}</p> */}
            <p className="item-price">Price: Rs. {item.price}</p>
            <p className="item-seller">Seller: {item.userName}</p>
            <div className="item-counter">
              <button className="counter-btn" onClick={() => decreaseQuantity(item)}> - </button>
              <span className="quantity">{item.quantity}</span>
              <button className="counter-btn" onClick={() => increaseQuantity(item)}> + </button>
            </div>
            <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      <p className='total-amount'>Total Amount: Rs. {totalAmount}</p>
      <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
      {showDialog && (
        <div className="payment-dialog">
          <button className="close-btn" onClick={() => setShowDialog(false)}>Close</button>
          <h2>Select Payment Option</h2>
          <button className='khalti-button' onClick={() => handlePaymentOptionSelect('khalti')}>Khalti</button>
          <button className='cod-button' onClick={() => handlePaymentOptionSelect('Cash on Delivery')}>Cash on Delivery</button>
        </div>
      )}
      {/* {selectedPaymentOption === 'khalti' && (

      )} */}
    </div>
  );
}

export default AddToCartPage;
