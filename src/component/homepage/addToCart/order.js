// Inside the OrdersPage component

import React, { useEffect, useState } from 'react';
import './order.css';
import { firestore, auth } from '../../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (currentUser) {
          const ordersCollection = collection(firestore, 'Orders');
          const ordersSnapshot = await getDocs(query(ordersCollection, where('userEmail', '==', currentUser.email)));
          const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  return (
    <div className="orders-page">
      <h1 className="page-title">Orders</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="orders-container">
          {orders.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            orders.map(order => (
              <div className="order-card" key={order.id}>
                <h2>Order ID: {order.id}</h2>
                <p>Date & Time: {new Date(order.dateTime).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  timeZoneName: 'short'
                })}</p>
                <p>Total Amount: Rs. {order.totalAmount}</p>
                <p>Payment Option: {order.paymentOption}</p>
                <h3>Cart Items:</h3>
                <ul className='order-cart-items'>
                  {order.cartItems.map(item => (
                    <li className='order-cart' key={item.id}>
                      {item.itemTitle} - Rs. {item.price} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
