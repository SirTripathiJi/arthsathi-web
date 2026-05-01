import React from "react";
import { Link } from "react-router-dom";

function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="section-title">
        <h2>Simple, Honest Pricing.</h2>
        <p>No hidden fees. No per-device charges. Pay once, use everywhere.</p>
      </div>

      <div className="pricing-grid">
        <div className="card pricing-card">
          <h3>Starter</h3>
          <p className="price">₹399<span style={{fontSize: "1.125rem"}}>/month</span></p>
          <p className="desc">For daily shop operations</p>
          <ul>
            <li>Inventory Control</li>
            <li>Billing System</li>
            <li>Basic Insights</li>
            <li>Offline Access</li>
          </ul>
          <Link to="/login" className="btn btn-secondary">Get Started</Link>
        </div>

        <div className="card pricing-card highlighted">
          <div className="badge">Best Value</div>
          <h3>Pro+ Preview</h3>
          <p className="price">₹799<span style={{fontSize: "1.125rem"}}>/month</span></p>
          <p className="desc">Premium intelligence</p>
          <ul>
            <li>Everything in Starter</li>
            <li>Smart Assistant (Soon)</li>
            <li>Voice Entries (Soon)</li>
            <li>Profit Intelligence</li>
            <li>Customer Insights</li>
          </ul>
          <Link to="/login" className="btn">Upgrade (Preview)</Link>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
