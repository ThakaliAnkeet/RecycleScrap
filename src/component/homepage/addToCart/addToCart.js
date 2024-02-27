import React, { useEffect, useState } from 'react';
import './addToCart.css';
import { firestore, auth, storage } from '../../../firebase/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import axios from 'axios';

function AddToCartPage() {
  const [customer,setCustomer]=useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [checkoutPayload,setCheckoutPayload]=useState('');

  const handleCheckout = () => {
    setShowDialog(true);
  }

  const handleKhalti = async () => {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    try {
      const userRef = doc(firestore, 'Users', customer.email);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const payload = {
          return_url: 'http://localhost:3000/home',
          website_url: 'http://localhost:3000/cart',
          amount: totalAmount * 100,
          purchase_order_id: "test12",
          purchase_order_name: "test",
          customer_info: {
            name: userData.name,
            email: customer.email,
            phone: "9844344807"
          },
        };
        setCheckoutPayload(payload);
  
        let response;
        let retryCount = 0;
        const maxRetries = 3;
        do {
          try {
            response = await axios.post('https://recyclescrap.onrender.com/khalti-api', checkoutPayload);
            if (response) {
              window.location.href = `${response?.data?.data?.payment_url}`;
              // Save order details to Firestore only after successful payment
              return saveOrderToFirestore('khalti');
            }
          } catch (error) {
            console.error('Error during checkout:', error);
            retryCount++;
            console.log(`Retrying (${retryCount}/${maxRetries})...`);
          }
        } while (retryCount < maxRetries);
  
        console.error('Exceeded maximum retry attempts. Please try again later.');
      } else {
        console.error('User document not found for email:', customer.email);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
  
  
  const handlePaymentOptionSelect = async (option) => {
    setSelectedPaymentOption(option);
    setShowDialog(false);
    // Save order details to Firestore
    await saveOrderToFirestore(option);
    // You can implement further actions based on the selected option
    if(option === 'khalti') {
      handleKhalti();
    }
  };

  const saveOrderToFirestore = async (paymentOption) => {
    try {
      const userEmail = customer.email;
      const dateTime = new Date().toISOString();
      const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const documentId = `${userEmail}-${Date.now()}`;
  
      // Extract cart item data for inclusion in the order
      const cartItemData = cartItems.map(item => ({
        id: item.id,
        itemTitle: item.itemTitle,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));
  
      const orderData = {
        userEmail: userEmail,
        dateTime: dateTime,
        totalAmount: totalAmount,
        paymentOption: paymentOption,
        cartItems: cartItemData // Include cart item data in the order
      };
  
      const orderDocRef = doc(firestore, 'Orders', documentId);
      await setDoc(orderDocRef, orderData);
  
      // Remove cart items from Firestore
      await Promise.all(cartItems.map(async (item) => {
        await deleteDoc(doc(firestore, 'UserCarts', item.id));
      }));
  
    } catch (error) {
      console.error('Error saving order to Firestore:', error);
    }
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
