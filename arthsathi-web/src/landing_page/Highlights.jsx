import React from "react";

const highlights = [
  "Reliable by Design: Built for real daily shop operations.",
  "Complete Data Control: Your data stays private and accessible.",
  "Flexible & Scalable: Grows as your business grows.",
  "Daily-Use Ready: Fast, clear, and dependable every day."
];

function Highlights() {
  return (
    <section className="highlights">
      <div className="highlights-container">
        {highlights.map((highlight, index) => (
          <div className="highlight-pill" key={index}>
            {highlight}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Highlights;
