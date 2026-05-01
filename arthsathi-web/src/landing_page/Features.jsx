import React from "react";

const features = [
  {
    title: "Inventory Control",
    text: "Stay accurate, avoid losses, and never miss a restock.",
    colorClass: "bg-yellow",
    comingSoon: false,
  },
  {
    title: "Billing Made Simple",
    text: "Fast entries with instant, real profit visibility.",
    colorClass: "bg-pink",
    comingSoon: false,
  },
  {
    title: "Business Insights",
    text: "Understand performance clearly. No noise, just useful data.",
    colorClass: "bg-blue",
    comingSoon: false,
  },
  {
    title: "Privacy-First",
    text: "100% local data storage. No cloud, no subscriptions.",
    colorClass: "bg-green",
    comingSoon: false,
  },
  {
    title: "Smart Assistant",
    text: "Simple business guidance based on your data.",
    colorClass: "bg-yellow",
    comingSoon: true,
  },
  {
    title: "Voice Entries",
    text: "Add transactions by speaking naturally.",
    colorClass: "bg-pink",
    comingSoon: true,
  },
  {
    title: "Profit Intelligence",
    text: "See true profit after cost and expenses.",
    colorClass: "bg-blue",
    comingSoon: false,
  },
  {
    title: "Customer Insights",
    text: "Identify reliable and risky customers.",
    colorClass: "bg-green",
    comingSoon: false,
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
          <div className="card feature-card" key={item.title}>
            <div className={`feature-icon ${item.colorClass}`}></div>
            <h3>{item.title}</h3>
            {item.comingSoon && <span className="coming-soon-label">Coming Soon</span>}
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;