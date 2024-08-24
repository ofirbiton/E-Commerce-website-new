import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/checkout.css';

const Checkout = ({ cartItems }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('3-day');
  const [orderNumber, setOrderNumber] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the form
    if (!name || !email || !phone || !address || !cartItems.length) {
      alert('Please fill all fields and ensure the cart is not empty.');
      return;
    }
  
    try {
      // Submit the order to the server
      const response = await fetch('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          shippingMethod,
          cartItems,
          totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Order submission failed: ${errorMessage}`);
      }
  
      const data = await response.json();
      setOrderNumber(data.orderNumber);
  
      // Clear the cart
      localStorage.removeItem('cart');
  
      // Show order number for 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-cart-items">
        {cartItems.map((item) => (
          <div className="checkout-cart-item" key={item._id}>
            <img src={item.image} alt={item.name} className="checkout-item-image" />
            <div className="checkout-item-details">
              <h3 className="checkout-item-name">{item.name}</h3>
              <span className="checkout-item-quantity">Quantity: {item.quantity}</span>
              <span className="checkout-item-price">Price per unit: ₪{item.price}</span>
              <span className="checkout-item-total">Total: ₪{item.price * item.quantity}</span>
            </div>
          </div>
        ))}
      </div>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="checkout-form-group">
          <label className="checkout-form-label">Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="checkout-form-input" 
            required 
          />
        </div>
        <div className="checkout-form-group">
          <label className="checkout-form-label">Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="checkout-form-input" 
            required 
          />
        </div>
        <div className="checkout-form-group">
          <label className="checkout-form-label">Phone:</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="checkout-form-input" 
            required 
          />
        </div>
        <div className="checkout-form-group">
          <label className="checkout-form-label">Address:</label>
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            className="checkout-form-input" 
            required 
          />
        </div>
        <div className="checkout-form-group">
          <label className="checkout-form-label">Shipping Method:</label>
          <select 
            value={shippingMethod} 
            onChange={(e) => setShippingMethod(e.target.value)} 
            className="checkout-form-select" 
            required
          >
            <option value="3-day">3-day shipping</option>
            <option value="14-day">14-day shipping (free)</option>
          </select>
        </div>
        <h3 className="checkout-total-price">
          Total Price: ₪{cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
        </h3>
        <button type="submit" className="checkout-submit-button">Place Order</button>
      </form>
      {orderNumber && (
        <div className="checkout-order-number">
          <h2>Thank you for your order!</h2>
          <p>Your order number is: {orderNumber}</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
