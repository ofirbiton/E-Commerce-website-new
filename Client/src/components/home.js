// Home.js
import React from 'react';
import Products from './products';
import heroImage from './icons/logofront.jpg';
import './style/home.css';

const Home = ({ addToCart }) => {
  return (
    <section className="home">
      <div className="hero">
        <img src={heroImage} alt="main picture"/>
        <div className="heroText">
          <h1>LEH LEHA</h1>
          <p>Shoes As A Lifestyle</p>
        </div>
      </div>

      <Products addToCart={addToCart} />
    </section>
  );
};

export default Home;
