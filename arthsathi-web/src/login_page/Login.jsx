import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import './Login.css';

function Login() {
  // Toggle between Login and Sign Up views
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Input states
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();

    // Get list of all registered users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLoginMode) {
      // 1. LOGIN LOGIC
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Save current user session
        localStorage.setItem("authUser", JSON.stringify(foundUser));
        navigate('/dashboard');
      } else {
        alert("Invalid email or password!");
      }
    } else {
      // 2. SIGN UP LOGIC
      const newUser = {
        username: fullName,
        shopName: shopName,
        email: email,
        password: password
      };

      // Add new user to the list
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Log them in immediately
      localStorage.setItem("authUser", JSON.stringify(newUser));
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLoginMode ? "Welcome back" : "Create account"}</h2>
        </div>
        
        {/* Toggle Tabs */}
        <div className="auth-tabs">
          <button 
            type="button"
            className={`tab-btn ${isLoginMode ? 'active' : ''}`} 
            onClick={() => setIsLoginMode(true)}
          >
            Login
          </button>
          <button 
            type="button"
            className={`tab-btn ${!isLoginMode ? 'active' : ''}`} 
            onClick={() => setIsLoginMode(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form className="auth-form" onSubmit={handleAuth}>
          {!isLoginMode && (
            <>
              <div className="input-group">
                <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
              <div className="input-group">
                <input type="text" placeholder="Store Name" value={shopName} onChange={e => setShopName(e.target.value)} required />
              </div>
            </>
          )}
          <div className="input-group">
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-btn">
            {isLoginMode ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          {isLoginMode ? (
            <p>Don't have an account? <span onClick={() => setIsLoginMode(false)}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLoginMode(true)}>Login</span></p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
