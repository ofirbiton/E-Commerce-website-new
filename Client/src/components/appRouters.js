// /*<!-- Ofir Biton 208582494 & Noe Mignolet 209709260 -->*/

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home';
import Checkout from './checkout';
import Navbar from './navbar';
import NotFound from './notFound';

const AppRouters = () => {
  // State to hold the cart items
  const [cartItems, setCartItems] = useState([]);

  // Effect to load cart items from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // Function to update cart items in state and localStorage
  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Function to add a product to the cart
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      // If item exists, increment its quantity
      updatedCart = cartItems.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Otherwise, add new item with quantity 1
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }

    updateCart(updatedCart);
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    updateCart(updatedCart);
  };

  // Function to update the quantity of a product in the cart
  const updateCartQuantity = (productId, quantity) => {
    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity } : item
    );
    updateCart(updatedCart);
  };

  // Function to calculate the total price of items in the cart
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
        {/* Route for the Home component */}
        <Route path="/" element={<Home addToCart={addToCart} />} />
        {/* Route for the Checkout component */}
        <Route
          path="/checkout"
          element={<Checkout cartItems={cartItems} setCartItems={setCartItems}/>}
        />
        {/* Route for the page not found component */}
        <Route path="/*" element={<NotFound></NotFound>}/>
      </Routes>
    </Router>
  );
};

export default AppRouters;
