// /*<!-- Ofir Biton 208582494 & Noe Mignolet 209709260 -->*/

import React from 'react';
import './style/notFound.css';

// NotFound component to display a 404 error message
const NotFound = () => {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__message">Oops! The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
