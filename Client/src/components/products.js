// Products.js
import React, { useEffect, useState } from 'react';
import './style/products.css';

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('There was an error fetching the products!', error));
  }, []);

  return (
    <div className="products-grid">
      {products.map((product, index) => (
        <div key={index} className="product">
          <img src={product.image} alt={product.title} />
          <h3>{product.title}</h3>
          <span className="item-price">ILS{product.price}</span>
          <button className="add-to-cart" onClick={() => addToCart(product)}>ADD TO BAG</button>
        </div>
      ))}
    </div>
  );
};

export default Products;
