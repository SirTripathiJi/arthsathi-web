import React from 'react';
import Card from './Card';

function Overview({ inventory, sales }) {
  const totalSales = (sales || []).reduce((sum, sale) => sum + (sale.total || 0), 0);
  const netProfit = (sales || []).reduce((sum, sale) => sum + (sale.profit || 0), 0);
  const stockCount = (inventory || []).reduce((sum, item) => sum + (item.qty || 0), 0);
  
  const today = new Date().toDateString();
  const todaySales = (sales || []).filter(s => {
    if (!s.date) return false;
    return new Date(s.date).toDateString() === today;
  });

  const lowStock = (inventory || []).filter(item => (item.qty || 0) <= 5);

  return (
    <div className="dash-section">
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <Card accentColor="#facc15">
          <h4>Total Sales</h4>
          <p className="stat-value">₹{totalSales}</p>
        </Card>
        <Card accentColor="#22c55e">
          <h4>Net Profit</h4>
          <p className="stat-value">₹{netProfit}</p>
        </Card>
        <Card accentColor="#38bdf8">
          <h4>Products in Stock</h4>
          <p className="stat-value">{stockCount}</p>
        </Card>
        <Card accentColor="#fb7185">
          <h4>Transactions Today</h4>
          <p className="stat-value">{todaySales.length}</p>
        </Card>
      </div>

      <div className="grid-2col">
        <Card accentColor="#38bdf8">
          <h3 style={{ marginBottom: '16px' }}>Cash Flow Summary</h3>
          <p><strong>Total Revenue:</strong> ₹{totalSales}</p>
          <p><strong>Total Profit:</strong> ₹{netProfit}</p>
          <p><strong>Profit Margin:</strong> {totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0}%</p>
        </Card>
        
        <Card accentColor="#fb7185">
          <h3 style={{ marginBottom: '16px' }}>Low Stock Alerts</h3>
          {lowStock.length === 0 ? <p>All items have sufficient stock.</p> : (
            <ul style={{ paddingLeft: '20px' }}>
              {lowStock.map(item => (
                <li key={item.id} style={{ marginBottom: '8px' }}>
                  {item.name} ({item.category}) - Only {item.qty} left
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
export default Overview;
