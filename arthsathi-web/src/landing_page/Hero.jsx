function Hero() {
  return (
    <section className="hero">
      <div className="hero-badge">Inventory Management for Local Shops</div>
      <h1>Simple stock tracking for kirana and local stores</h1>
      <p>
        Manage products, stock in, stock out, low stock alerts, and daily sales
        in one clean system.
      </p>

      <div className="hero-buttons">
        <a className="primary-btn" href="#features">Explore Features</a>
        <a className="secondary-btn" href="#how-it-works">See How It Works</a>
      </div>

      <div className="hero-card">
        <div>
          <span>Total Products</span>
          <h3>128</h3>
        </div>
        <div>
          <span>Low Stock Items</span>
          <h3>14</h3>
        </div>
        <div>
          <span>Today Sales</span>
          <h3>₹4,850</h3>
        </div>
      </div>
    </section>
  );
}

export default Hero;