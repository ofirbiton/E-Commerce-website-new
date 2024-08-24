import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home';
import Cart from './cart';
import Checkout from './checkout';
import Navbar from './navbar';

const AppRouters = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }

    updateCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    updateCart(updatedCart);
  };

  const updateCartQuantity = (productId, quantity) => {
    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity } : item
    );
    updateCart(updatedCart);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Router>
      <Navbar
        cartItems={cartItems}
        totalPrice={calculateTotalPrice()}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
      />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route
          path="/checkout"
          element={<Checkout cartItems={cartItems} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouters;
