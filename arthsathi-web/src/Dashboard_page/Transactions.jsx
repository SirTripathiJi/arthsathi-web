import React, { useState } from 'react';
import Card from './Card';

function Transactions({ sales }) {
  const [filterDate, setFilterDate] = useState('');
  
  const filteredSales = filterDate 
    ? sales.filter(s => new Date(s.date).toISOString().split('T')[0] === filterDate)
    : sales;

  return (
    <div className="dash-section">
      <Card accentColor="#38bdf8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>Transaction History</h3>
          <input className="dash-input" type="date" style={{ width: '200px' }} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Bill No</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.slice().reverse().map(sale => (
                <tr key={sale.id}>
                  <td>{new Date(sale.date).toLocaleString()}</td>
                  <td>#{sale.id}</td>
                  <td>{sale.customer}</td>
                  <td>{sale.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</td>
                  <td>₹{sale.total}</td>
                  <td style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{sale.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
export default Transactions;
