// /*<!-- Ofir Biton 208582494 & Noe Mignolet 209709260 -->*/

import React from 'react';
import Products from './products';
import heroImage from './icons/logofront.jpg';
import './style/home.css';

const Home = ({ addToCart }) => {
  return (
    <section className="home">
      {/* Hero section with main picture and text */}
      <div className="hero">
        <img src={heroImage} alt="main picture"/>
        <div className="hero-text">
          <h1>LEH LEHA</h1>
          <p>Shoes As A Lifestyle</p>
        </div>
      </div>

      {/* Products component to display the list of products */}
      <Products addToCart={addToCart} />
    </section>
  );
};

export default Home;
