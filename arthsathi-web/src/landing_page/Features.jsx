import React from "react";

const features = [
  {
    title: "Inventory Control",
    text: "Stay accurate, avoid losses, and never miss a restock.",
    color: "#ffd84d",
    icon: "📦",
    comingSoon: false,
  },
  {
    title: "Billing Made Simple",
    text: "Fast entries with instant, real profit visibility.",
    color: "#ff4f8b",
    icon: "🧾",
    comingSoon: false,
  },
  {
    title: "Business Insights",
    text: "Understand performance clearly. No noise, just useful data.",
    color: "#3fd0ff",
    icon: "📊",
    comingSoon: false,
  },
  {
    title: "Privacy-First",
    text: "100% local data storage. No cloud, no subscriptions.",
    color: "#22c55e",
    icon: "🔒",
    comingSoon: false,
  },
  {
    title: "Smart Assistant",
    text: "Simple business guidance based on your data.",
    color: "#ffd84d",
    icon: "🤖",
    comingSoon: true,
  },
  {
    title: "Voice Entries",
    text: "Add transactions by speaking naturally.",
    color: "#ff4f8b",
    icon: "🎙️",
    comingSoon: true,
  },
  {
    title: "Profit Intelligence",
    text: "See true profit after cost and expenses.",
    color: "#3fd0ff",
    icon: "💰",
    comingSoon: false,
  },
  {
    title: "Customer Insights",
    text: "Identify reliable and risky customers.",
    color: "#22c55e",
    icon: "👥",
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
          <div className="feature-item-card" key={item.title}>
            <div className="feature-icon" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <h3>
              {item.title}
              {item.comingSoon && <span className="coming-soon-label">Coming Soon</span>}
            </h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;