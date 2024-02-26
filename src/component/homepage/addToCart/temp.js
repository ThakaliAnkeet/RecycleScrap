import React, { useEffect, useState } from 'react';
import './addToCart.css';
import { firestore, auth, storage } from '../../../firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import EsewaPayment from '../../../esewa/eswea';

function AddToCartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);


  const handleCheckout = () => {
    setShowDialog(true);
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
        try {
          const userEmail = user.email;
          const q = query(collection(firestore, 'UserCarts'), where('userEmail', '==', userEmail));
          const querySnapshot = await getDocs(q);

          const items = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const imageRef = ref(storage, `Product_Image/Scraps/${data.email}/${data.imageName}`);
            const imageUrl = await getDownloadURL(imageRef);
            return { id: doc.id, ...data, imageUrl };
          }));

          const initializedItems = initializeCartItems(items); // Initialize items with quantity property
          console.log('Items:', initializedItems);
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
    <button className='esewa-button' onClick={() => handlePaymentOptionSelect('eSewa')}>eSewa</button>
    <button className='cod-button' onClick={() => handlePaymentOptionSelect('Cash on Delivery')}>Cash on Delivery</button>
  </div>
)}
{selectedPaymentOption === 'googlePay' && (
      <EsewaPayment totalAmount={totalAmount} />
      )}
    </div>
  );
}

export default AddToCartPage;
