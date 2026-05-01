import React from "react";

const features = [
  {
    title: "Inventory Control",
    text: "Stay accurate, avoid losses, and never miss a restock.",
  },
  {
    title: "Billing Made Simple",
    text: "Fast entries with instant, real profit visibility.",
  },
  {
    title: "Business Insights",
    text: "Understand performance clearly. No noise, just useful data.",
  },
  {
    title: "Privacy-First",
    text: "100% local data storage. No cloud, no subscriptions.",
  },
  {
    title: "Smart Assistant (Coming Soon)",
    text: "Simple business guidance based on your data.",
  },
  {
    title: "Voice Entries (Coming Soon)",
    text: "Add transactions by speaking naturally.",
  },
  {
    title: "Profit Intelligence",
    text: "See true profit after cost and expenses.",
  },
  {
    title: "Customer Insights",
    text: "Identify reliable and risky customers.",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="section-title">
        <h2>Features</h2>
        <p>Everything needed for a small shop inventory project.</p>
      </div>
      <div className="features-grid">
        {features.map((item) => (
          <div className="card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;