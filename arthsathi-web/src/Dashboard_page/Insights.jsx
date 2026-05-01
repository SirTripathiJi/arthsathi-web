import React from 'react';
import Card from './Card';

function Insights({ inventory, sales }) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = totalRevenue * 0.25; 
  
  const lowStock = inventory.filter(item => item.qty < 5);
  
  const itemSales = {};
  sales.forEach(sale => {
    itemSales[sale.itemName] = (itemSales[sale.itemName] || 0) + sale.qty;
  });
  
  let topItem = 'None';
  let maxQty = 0;
  Object.keys(itemSales).forEach(key => {
    if (itemSales[key] > maxQty) {
      maxQty = itemSales[key];
      topItem = key;
    }
  });

  return (
    <div className="dash-section">
      <h2 style={{ marginBottom: '24px' }}>Business Insights</h2>
      <div className="grid-2col">
        <Card accentColor="#fb7185">
          <h3 style={{ marginBottom: '16px' }}>Performance</h3>
          <p><strong>Total Revenue:</strong> ₹{totalRevenue}</p>
          <p style={{ marginTop: '12px' }}><strong>Estimated Profit (25%):</strong> ₹{totalProfit}</p>
          <p style={{ marginTop: '12px' }}><strong>Top Selling Item:</strong> {topItem}</p>
        </Card>
        
        <Card accentColor="#facc15">
          <h3 style={{ marginBottom: '16px' }}>Low Stock Alerts</h3>
          {lowStock.length === 0 ? <p>All items have sufficient stock.</p> : (
            <ul style={{ paddingLeft: '20px' }}>
              {lowStock.map(item => (
                <li key={item.id} style={{ marginBottom: '8px' }}>
                  {item.name} - Only {item.qty} left
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Insights;
