import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './style/navbar.css';
import logo from './icons/LEH LEHA.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCartArrowDown, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ cartItems, totalPrice, updateCartQuantity, removeFromCart }) => {
  const [showCart, setShowCart] = useState(false);
  const location = useLocation(); 
  const [icon, setIcon] = useState(faCartShopping); 

  useEffect(() => {
    setIcon(cartItems.length > 0 ? faCartArrowDown : faCartShopping);
  }, [cartItems.length]);

  useEffect(() => {
    if (location.pathname === '/checkout') {
      setShowCart(false);
    }
  }, [location.pathname]);

  const toggleCart = () => {
    if (location.pathname !== '/checkout') {
      setShowCart(prev => !prev);
    }
  };

  const handleIncrement = (itemId, currentQuantity) => {
    updateCartQuantity(itemId, currentQuantity + 1);
  };

  const handleDecrement = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateCartQuantity(itemId, currentQuantity - 1);
    }
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  const isCheckoutPage = location.pathname === '/checkout';

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="leh leha" className="logoImage" />
        </Link>
      </div>
      {!isCheckoutPage && (
        <button className="cartButton" onClick={toggleCart} disabled={location.pathname === '/checkout'}>
          <div className="cartIconContainer">
            <FontAwesomeIcon
              icon={faCartShopping}
              className={`cartIcon ${icon === faCartShopping ? 'show' : 'hide'}`}
            />
            <FontAwesomeIcon
              icon={faCartArrowDown}
              className={`cartIcon ${icon === faCartArrowDown ? 'show' : 'hide'}`}
            />
          </div>
          {cartItems.length > 0 && (
            <span className="cartCount">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          )}
          {totalPrice > 0 && (
            <span className="cartTotal">ILS{totalPrice}</span>
          )}
        </button>
      )}

      <div className={`cart-overlay ${showCart ? 'show' : ''}`}>
        <div className={`cart-items ${cartItems.length === 0 ? 'empty-cart' : ''}`}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <span className="item-price">ILS{item.price}</span>
                  <span>{item.title}</span>
                  
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
                  <button className="removeItem" onClick={() => handleRemove(item._id)}>
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
