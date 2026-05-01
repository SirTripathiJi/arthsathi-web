import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card';

function Insights({ sales }) {
  // Aggregate sales by date
  const salesByDate = {};
  const productSales = {};

  (sales || []).forEach(sale => {
    const dateStr = sale.date ? new Date(sale.date).toLocaleDateString() : new Date().toLocaleDateString();
    if (!salesByDate[dateStr]) salesByDate[dateStr] = { date: dateStr, sales: 0, profit: 0 };
    salesByDate[dateStr].sales += (sale.total || 0);
    salesByDate[dateStr].profit += (sale.profit || 0);

    const items = sale.items || [{ name: sale.itemName || 'Unknown Item', qty: sale.qty || 1 }];
    items.forEach(it => {
      productSales[it.name] = (productSales[it.name] || 0) + (it.qty || 1);
    });
  });

  const chartData = Object.values(salesByDate);
  const topProductsData = Object.keys(productSales).map(k => ({ name: k, qty: productSales[k] })).sort((a,b) => b.qty - a.qty).slice(0, 5);

  return (
    <div className="dash-section">
      <div className="grid-2col" style={{ marginBottom: '24px' }}>
        <Card accentColor="#facc15">
          <h3 style={{ marginBottom: '16px' }}>Sales vs Profit Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#38bdf8" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card accentColor="#fb7185">
          <h3 style={{ marginBottom: '16px' }}>Top Products by Volume</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={topProductsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#facc15" name="Quantity Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default Insights;
