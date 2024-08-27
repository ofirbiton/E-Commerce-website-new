// /*<!-- Ofir Biton 208582494 & Noe Mignolet 209709260 -->*/

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './style/navbar.css';
import logo from './icons/LEH LEHA.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCartArrowDown, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ cartItems, totalPrice, updateCartQuantity, removeFromCart }) => {
  // State to control the visibility of the cart overlay
  const [showCart, setShowCart] = useState(false);
  // Hook to get the current route path
  const location = useLocation(); 
  // State to manage the icon displayed for the cart button
  const [icon, setIcon] = useState(faCartShopping); 

  // Update the cart icon based on the number of items in the cart
  useEffect(() => {
    setIcon(cartItems.length > 0 ? faCartArrowDown : faCartShopping);
  }, [cartItems.length]);

  // Hide the cart overlay when navigating to the checkout page
  useEffect(() => {
    if (location.pathname === '/checkout') {
      setShowCart(false);
    }
  }, [location.pathname]);

  // Toggle the visibility of the cart overlay
  const toggleCart = () => {
    if (location.pathname !== '/checkout') {
      setShowCart(prev => !prev);
    }
  };

  // Increment the quantity of an item in the cart
  const handleIncrement = (itemId, currentQuantity) => {
    updateCartQuantity(itemId, currentQuantity + 1);
  };

  // Decrement the quantity of an item in the cart
  const handleDecrement = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateCartQuantity(itemId, currentQuantity - 1);
    }
  };

  // Remove an item from the cart
  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  // Check if the current page is the checkout page
  const isCheckoutPage = location.pathname === '/checkout';

  return (
    <nav className="navbar">
      {/* Logo section with link to the home page */}
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="leh leha" className="logo-image" />
        </Link>
      </div>
      {/* Cart button with conditional rendering based on the current path */}
      {!isCheckoutPage && (
        <button className="cart-button" onClick={toggleCart} disabled={location.pathname === '/checkout'}>
          <div className="cart-icon-container">
            {/* Display the appropriate cart icon */}
            <FontAwesomeIcon
              icon={faCartShopping}
              className={`cart-icon ${icon === faCartShopping ? 'show' : 'hide'}`}
            />
            <FontAwesomeIcon
              icon={faCartArrowDown}
              className={`cart-icon ${icon === faCartArrowDown ? 'show' : 'hide'}`}
            />
          </div>
          {/* Display cart item count and total price if there are items in the cart */}
          {cartItems.length > 0 && (
            <span className="cart-count">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          )}
          {totalPrice > 0 && (
            <span className="cart-total">₪{totalPrice}</span>
          )}
        </button>
      )}

      {/* Cart overlay displaying cart items and checkout button */}
      <div className={`cart-overlay ${showCart ? 'show' : ''}`}>
        <div className={`cart-items ${cartItems.length === 0 ? 'empty-cart' : ''}`}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                {/* Item image and details */}
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <span className="item-price">ILS{item.price}</span>
                  <span>{item.title}</span>
                  
                  {/* Quantity controls for each cart item */}
                  <div className="quantity-controls">
                    <span className="quantity-label">Qty:</span>
                    <button 
                      className="decrement" 
                      onClick={() => handleDecrement(item._id, item.quantity)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="increment" 
                      onClick={() => handleIncrement(item._id, item.quantity)}
                    >
                      +
                    </button>
                  </div>
                  <span className="item-subtotal">Subtotal ILS{item.price * item.quantity}</span>
                  {/* Remove button for each item */}
                  <button className="remove-item" onClick={() => handleRemove(item._id)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-cart-message">
              <h2>Your cart is empty</h2>
            </div>
          )}
        </div>
        {/* Checkout button */}
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <Link to="/checkout" onClick={() => setShowCart(false)}>
              <button>CHECKOUT</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

