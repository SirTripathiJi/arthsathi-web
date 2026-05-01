import React from 'react';
import Card from './Card';

function Stats({ sales, profit, orders, customers }) {
  const statsData = [
    { label: 'Total Sales', value: `₹${sales}`, color: '#facc15' },
    { label: 'Profit', value: `₹${profit}`, color: '#22c55e' },
    { label: 'Orders', value: orders, color: '#38bdf8' },
    { label: 'Customers', value: customers, color: '#fb7185' },
  ];

  return (
    <div className="stats-grid">
      {statsData.map((stat, idx) => (
        <Card key={idx} className="stat-item" accentColor={stat.color}>
          <h4>{stat.label}</h4>
          <p className="stat-value">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}

export default Stats;
