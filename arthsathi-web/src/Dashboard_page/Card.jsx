import React from 'react';

function Card({ children, className = '', accentColor = 'transparent' }) {
  return (
    <div className={`dash-card ${className}`}>
      <div className="card-accent" style={{ backgroundColor: accentColor }}></div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default Card;
