const steps = [
  "Add all products with price and stock.",
  "Update stock when items come in or sell out.",
  "View low stock items and daily sales summary.",
  "Manage expenses and keep records in one place.",
];

function HowItWorks() {
  return (
    <section className="how" id="how-it-works">
      <div className="section-title">
        <h2>How it works</h2>
        <p>Very simple flow for a local shop owner.</p>
      </div>

      <div className="steps">
        {steps.map((step, index) => (
          <div className="step" key={index}>
            <div className="step-no">0{index + 1}</div>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;