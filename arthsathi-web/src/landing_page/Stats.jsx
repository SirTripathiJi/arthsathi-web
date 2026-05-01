const stats = [
  { title: "Fast Setup", value: "2 min" },
  { title: "Easy Tracking", value: "Stock + Sales" },
  { title: "Simple UI", value: "Beginner Friendly" },
  { title: "Offline Save", value: "localStorage" },
];

function Stats() {
  return (
    <section className="stats">
      {stats.map((item) => (
        <div className="stat-box" key={item.title}>
          <h4>{item.value}</h4>
          <p>{item.title}</p>
        </div>
      ))}
    </section>
  );
}

export default Stats;