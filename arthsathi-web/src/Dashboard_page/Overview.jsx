import React from 'react';
import Card from './Card';

function Overview({ inventory, sales }) {
  const LOW_STOCK_LIMIT = 5;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getStatus = (item) => {
    const isLowStock = (item.qty || 0) <= LOW_STOCK_LIMIT;
    let isExpired = false;
    let isNearExpiry = false;

    if (item.expiry) {
      const expDate = new Date(item.expiry);
      expDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) isExpired = true;
      else if (diffDays <= 7) isNearExpiry = true;
    }
    return { isLowStock, isExpired, isNearExpiry };
  };

  const totalSales = (sales || []).reduce((sum, sale) => sum + (sale.total || 0), 0);
  const netProfit = (sales || []).reduce((sum, sale) => sum + (sale.profit || 0), 0);
  const stockCount = (inventory || []).reduce((sum, item) => sum + (item.qty || 0), 0);
  const todaySalesCount = (sales || []).filter(s => s.date && new Date(s.date).toDateString() === today.toDateString()).length;

  const lowStockItems = (inventory || []).filter(item => getStatus(item).isLowStock);
  const expiredItems = (inventory || []).filter(item => getStatus(item).isExpired);
  const nearExpiryItems = (inventory || []).filter(item => getStatus(item).isNearExpiry);

  const alerts = [...expiredItems.map(i => ({...i, type: 'Expired'})), 
                  ...nearExpiryItems.map(i => ({...i, type: 'Near Expiry'})), 
                  ...lowStockItems.map(i => ({...i, type: 'Low Stock'}))].slice(0, 3);

  return (
    <div className="dash-section">
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <Card accentColor="#facc15">
          <h4>Total Sales</h4>
          <p className="stat-value">₹{totalSales.toFixed(0)}</p>
        </Card>
        <Card accentColor="#22c55e">
          <h4>Net Profit</h4>
          <p className="stat-value">₹{netProfit.toFixed(0)}</p>
        </Card>
        <Card accentColor="#38bdf8">
          <h4>Products in Stock</h4>
          <p className="stat-value">{stockCount}</p>
        </Card>
        <Card accentColor="#fb7185">
          <h4>Transactions Today</h4>
          <p className="stat-value">{todaySalesCount}</p>
        </Card>
      </div>

      <div className="grid-2col">
        <Card accentColor="#fb7185">
          <h3 style={{ marginBottom: '16px' }}>Critical Alerts</h3>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>{lowStockItems.length}</p>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Low Stock</p>
            </div>
            <div>
              <p style={{ color: '#7f1d1d', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>{expiredItems.length}</p>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Expired</p>
            </div>
          </div>
          
          {alerts.length === 0 ? <p className="empty-state">No critical alerts.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {alerts.map((item, idx) => (
                <li key={idx} style={{ padding: '10px', borderBottom: '1px solid #eee', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.name}</span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: item.type === 'Expired' ? '#7f1d1d' : (item.type === 'Low Stock' ? '#ef4444' : '#f97316')
                  }}>{item.type}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card accentColor="#38bdf8">
          <h3 style={{ marginBottom: '16px' }}>Cash Flow</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Revenue:</span>
              <span style={{ fontWeight: 'bold' }}>₹{totalSales.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Profit:</span>
              <span style={{ fontWeight: 'bold', color: '#22c55e' }}>₹{netProfit.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <span>Average Margin:</span>
              <span style={{ fontWeight: 'bold' }}>{totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default Overview;
