import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './style/cart.css';

const Cart = ({ cartItems, removeFromCart, updateCart }) => {
  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) return;

    const updatedCart = cartItems.map(item =>
      item._id === id ? { ...item, quantity: parseInt(quantity, 10) } : item
    );
    updateCart(updatedCart);
  };

  const handleRemove = (id) => {
    const existingItem = cartItems.find(item => item._id === id);
    if (existingItem) {
      removeFromCart(existingItem);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-overlay">
      <div className="cart">
        {cartItems.length === 0 ? (
          <p>YOUR BAG IS EMPTY.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <img src={item.image} alt={item.title} />
                  <div className="item-details">
                    <h3>₪{item.price}</h3>
                    <h4>{item.title}</h4>
                    <label>
                      Quantity
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                      />
                    </label>
                    <span>Total: ₪{item.price * item.quantity}</span>
                  </div>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="removeItem"
                    onClick={() => handleRemove(item._id)}
                  />
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3 className="totalPrice">Total ₪{calculateTotalPrice()}</h3>
              <button onClick={() => window.location.href = '/checkout'}>Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
