import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <>
              <div className="input-group">
                <input type="text" placeholder="Full Name" required />
              </div>
              <div className="input-group">
                <input type="text" placeholder="Store Name" required />
              </div>
            </>
          )}
          <div className="input-group">
            <input type="email" placeholder="Email Address" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>
          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLogin(true)}>Login</span></p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
