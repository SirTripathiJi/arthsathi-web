function Navbar() {
  return (
    <header className="navbar">
      <a href="/" className="navbar-logo">ArthSaathi</a>
      <nav className="navbar-center">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <div className="navbar-right">
        <a href="#pricing" className="btn">Get Started</a>
      </div>
    </header>
  );
}

export default Navbar;