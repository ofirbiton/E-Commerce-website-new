// /*<!-- Ofir Biton 208582494 & Noe Mignolet 209709260 -->*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/checkout.css';

const Checkout = ({ cartItems, setCartItems }) => {
  // State hooks for form fields and error messages
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('3-day');
  const [orderNumber, setOrderNumber] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Function to calculate the total price including shipping
  const calculateTotalPrice = () => {
    const itemTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = shippingMethod === '3-day' ? 20 : 0;
    return itemTotal + shippingCost;
  };

  // Function to validate form fields and set error messages
  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = 'Please enter your name';
    if (!email) newErrors.email = 'Please enter your email';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!phone) newErrors.phone = 'Please enter your phone number';
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!address) newErrors.address = 'Please enter your address';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before proceeding
    if (!validateForm()) return;

    try {
      // Send a POST request to the server with order details
      const response = await fetch('http://localhost:3000/orders', {
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
          totalPrice: calculateTotalPrice(),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setOrderNumber(data.orderNumber);

      // Clear the cart and navigate to the home page after a delay
      localStorage.removeItem('cart');
      setCartItems([]);
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      alert(`Failed to fetch: ${error.message}`);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">CHECKOUT</h1>
      <div className="order-details">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          {/* Name input */}
          <div className="checkout-form-group">
            <label className="checkout-form-label">Name</label>
            {errors.name && <div className="error-message">{errors.name}</div>}
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="checkout-form-input" 
            />
          </div>

          {/* Email input */}
          <div className="checkout-form-group">
            <label className="checkout-form-label">Email</label>
            {errors.email && <div className="error-message">{errors.email}</div>}
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="checkout-form-input" 
            />
          </div>

          {/* Phone input */}
          <div className="checkout-form-group">
            <label className="checkout-form-label">Phone</label>
            {errors.phone && <div className="error-message">{errors.phone}</div>}
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="checkout-form-input" 
            />
          </div>

          {/* Address input */}
          <div className="checkout-form-group">
            <label className="checkout-form-label">Address</label>
            {errors.address && <div className="error-message">{errors.address}</div>}
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className="checkout-form-input" 
            />
          </div>

          {/* Shipping method selection */}
          <div className="checkout-form-group">
            <label className="checkout-form-label">Delivery</label>
            <select 
              value={shippingMethod} 
              onChange={(e) => setShippingMethod(e.target.value)} 
              className="checkout-form-select" 
            >
              <option value="3-day">3-day shipping (Additional ILS20)</option>
              <option value="14-day">14-day shipping (Free)</option>
            </select>
          </div>

          {/* Total price */}
          <h3 className="checkout-total-price">
            TOTAL TO PAY ILS{calculateTotalPrice()}
          </h3>

          {/* Submit button */}
          <div className="place-order-container">
            <button type="submit" className="checkout-submit-button">BUY NOW</button>
          </div>
        </form>
      </div>

      {/* Display cart items */}
      <div className="checkout-cart-items">
        {cartItems.map((item) => (
          <div className="checkout-cart-item" key={item._id}>
            <img src={item.image} alt={item.name} className="checkout-item-image" />
            <div className="checkout-item-details">
              <span className="checkout-item-price">ILS{item.price}</span>
              <span className="checkout-item-name">{item.title}</span>
              <span className="checkout-item-quantity">Qty: {item.quantity}</span>
              <span className="checkout-item-total">Subtotal ILS{item.price * item.quantity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Display order confirmation */}
      {orderNumber && (
        <div className="checkout-order-number">
          <h2>Thank you for your order!</h2>
          <p>ORDER NUMBER {orderNumber}</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
