import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/checkout.css';

const Checkout = ({ cartItems, setCartItems }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('3-day');
  const [orderNumber, setOrderNumber] = useState(null);
  const navigate = useNavigate();

  // Function to calculate the total price including shipping
  const calculateTotalPrice = () => {
    const itemTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = shippingMethod === '3-day' ? 20 : 0;
    return itemTotal + shippingCost;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the form
    if (!name || !email || !phone || !address || !cartItems.length) {
      alert('Please fill all fields and ensure the cart is not empty.');
      return;
    }
  
    try {
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
  
      // Clear the cart and navigate
      localStorage.removeItem('cart');
      setCartItems([]); 
      setTimeout(() => {
        navigate('/');
      }, 60000);
  
    } catch (error) {
      alert(`Failed to fetch: ${error.message}`);
    }
  };
  
  return (
    <div className="checkout-container">
      <h1 className="checkout-title">CHECKOUT</h1>
      <div className="order-details">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-form-group">
            <label className="checkout-form-label">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="checkout-form-input" 
              required 
            />
          </div>
          <div className="checkout-form-group">
            <label className="checkout-form-label">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="checkout-form-input" 
              required 
            />
          </div>
          <div className="checkout-form-group">
            <label className="checkout-form-label">Phone</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="checkout-form-input" 
              required 
            />
          </div>
          <div className="checkout-form-group">
            <label className="checkout-form-label">Address</label>
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className="checkout-form-input" 
              required 
            />
          </div>
          <div className="checkout-form-group">
            <label className="checkout-form-label">Delivery</label>
            <select 
              value={shippingMethod} 
              onChange={(e) => setShippingMethod(e.target.value)} 
              className="checkout-form-select" 
              required
            >
              <option value="3-day">3-day shipping (Additional 20₪)</option>
              <option value="14-day">14-day shipping (Free)</option>
            </select>
          </div>
          <h3 className="checkout-total-price">
            TOTAL TO PAY ₪{calculateTotalPrice()}
          </h3>
          <div className="place-order-container">
            <button type="submit" className="checkout-submit-button">BUY NOW</button>
          </div>
        </form>
      </div>
      <div className="checkout-cart-items">
        {cartItems.map((item) => (
          <div className="checkout-cart-item" key={item._id}>
            <img src={item.image} alt={item.name} className="checkout-item-image" />
            <div className="checkout-item-details">
              <span className="checkout-item-price">₪{item.price}</span>
              <span className="checkout-item-name">{item.title}</span>
              <span className="checkout-item-quantity">Qty: {item.quantity}</span>
              <span className="checkout-item-total">Subtotal ₪{item.price * item.quantity}</span>
            </div>
          </div>
        ))}
      </div>
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

