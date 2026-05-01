import React from 'react';
import Card from './Card';

function Overview({ inventory, sales }) {
  // Current date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper to check item alerts
  const checkAlerts = (item) => {
    const isLow = item.qty <= 5;
    let isExpired = false;

    if (item.expiry) {
      const expDate = new Date(item.expiry);
      expDate.setHours(0, 0, 0, 0);
      if (expDate < today) isExpired = true;
    }
    return { isLow, isExpired };
  };

  // --- CALCULATE SUMMARY STATS ---
  
  // 1. Total Sales (Revenue)
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  
  // 2. Net Profit
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  
  // 3. Total Items in Stock
  const totalStock = inventory.reduce((sum, item) => sum + item.qty, 0);
  
  // 4. Sales Made Today
  const salesToday = sales.filter(sale => {
    const saleDate = new Date(sale.date).toDateString();
    return saleDate === today.toDateString();
  }).length;

  // --- CALCULATE ALERTS ---
  
  const lowStockItems = inventory.filter(item => checkAlerts(item).isLow);
  const expiredItems = inventory.filter(item => checkAlerts(item).isExpired);

  // Combine top 3 alerts to show in the list
  const recentAlerts = [
    ...expiredItems.map(i => ({ name: i.name, type: 'Expired' })),
    ...lowStockItems.map(i => ({ name: i.name, type: 'Low Stock' }))
  ].slice(0, 3);

  return (
    <div className="dash-section">
      {/* Top Row: Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <Card accentColor="#facc15">
          <h4>Total Sales</h4>
          <p className="stat-value">₹{totalRevenue.toFixed(0)}</p>
        </Card>
        <Card accentColor="#22c55e">
          <h4>Net Profit</h4>
          <p className="stat-value">₹{totalProfit.toFixed(0)}</p>
        </Card>
        <Card accentColor="#38bdf8">
          <h4>Items in Stock</h4>
          <p className="stat-value">{totalStock}</p>
        </Card>
        <Card accentColor="#fb7185">
          <h4>Sales Today</h4>
          <p className="stat-value">{salesToday}</p>
        </Card>
      </div>

      {/* Bottom Row: Alerts and Cash Flow */}
      <div className="grid-2col">
        {/* Alerts Card */}
        <Card accentColor="#fb7185">
          <h3 style={{ marginBottom: '16px' }}>Critical Alerts</h3>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>{lowStockItems.length}</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Low Stock</p>
            </div>
            <div>
              <p style={{ color: '#7f1d1d', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>{expiredItems.length}</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Expired</p>
            </div>
          </div>
          
          {recentAlerts.length === 0 ? (
            <p className="empty-state">No alerts today!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recentAlerts.map((alert, index) => (
                <li key={index} style={{ padding: '10px', borderBottom: '1px solid var(--grid-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{alert.name}</span>
                  <span style={{ fontWeight: 'bold', color: alert.type === 'Expired' ? '#7f1d1d' : '#ef4444' }}>{alert.type}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Cash Flow Card */}
        <Card accentColor="#38bdf8">
          <h3 style={{ marginBottom: '16px' }}>Business Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Revenue:</span>
              <span style={{ fontWeight: 'bold' }}>₹{totalRevenue.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Profit:</span>
              <span style={{ fontWeight: 'bold', color: '#22c55e' }}>₹{totalProfit.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--grid-color)', paddingTop: '16px' }}>
              <span>Profit Margin:</span>
              <span style={{ fontWeight: 'bold' }}>
                {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Overview;
