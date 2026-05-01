import React from 'react';
import './Login.css';

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
