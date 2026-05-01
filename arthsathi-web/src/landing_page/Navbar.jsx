function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">Arthsathi</div>
      <nav className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="nav-btn">Get Started</button>
    </header>
  );
}

export default Navbar;