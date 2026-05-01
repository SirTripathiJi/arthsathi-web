import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">ArthSaathi</Link>
      <nav className="navbar-center">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <div className="navbar-right">
        <Link to="/login" className="btn">Get Started</Link>
      </div>
    </header>
  );
}

export default Navbar;