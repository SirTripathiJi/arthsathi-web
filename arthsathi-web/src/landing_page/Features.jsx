const features = [
  {
    title: "Product Management",
    text: "Add, edit, delete, and search products easily.",
  },
  {
    title: "Stock Control",
    text: "Increase stock when goods arrive and reduce stock after sales.",
  },
  {
    title: "Low Stock Alert",
    text: "See which items need to be reordered soon.",
  },
  {
    title: "Daily Summary",
    text: "Check simple sales and stock overview in one place.",
  },
  {
    title: "Expense Entry",
    text: "Add shop expenses like rent, transport, and electricity.",
  },
  {
    title: "Local Storage",
    text: "Data stays saved in the browser without a backend.",
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
          <div className="feature-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;