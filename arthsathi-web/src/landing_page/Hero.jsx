import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <h1>Run your business with clarity.</h1>
      <p className="subtitle">Track inventory, record sales, and know your exact profit — without confusion.</p>
      <p className="extra">Built for real shopkeepers. Fast. Offline. Reliable.</p>
      <Link to="/login" className="btn">Get Started</Link>
      <p className="note">Plans from ₹399/month · Cancel anytime · Works fully offline.</p>
    </section>
  );
}

export default Hero;