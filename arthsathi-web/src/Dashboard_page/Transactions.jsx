import React, { useState } from 'react';
import Card from './Card';

function Transactions({ sales }) {
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  let filteredSales = sales || [];
  
  if (filterDate) {
    filteredSales = filteredSales.filter(s => {
      if (!s.date) return false;
      return new Date(s.date).toISOString().split('T')[0] === filterDate;
    });
  }
  
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredSales = filteredSales.filter(s => 
      (s.customer && s.customer.toLowerCase().includes(q)) || 
      (s.id && s.id.toString().includes(q))
    );
  }

  return (
    <div className="dash-section">
      <Card accentColor="#38bdf8">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0 }}>Transaction History</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <input className="dash-input" type="text" placeholder="Search customer or bill #..." style={{ width: '250px' }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <input className="dash-input" type="date" style={{ width: '180px' }} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          </div>
        </div>
        
        {filteredSales.length === 0 ? <p className="empty-state">No transactions found matching your criteria.</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice().reverse().map(sale => {
                  const paid = sale.paid ?? sale.total;
                  const due = sale.due ?? 0;
                  const status = sale.status || (due <= 0 ? 'Paid' : 'Due');
                  
                  return (
                    <tr key={sale.id}>
                      <td>{sale.date ? new Date(sale.date).toLocaleString() : new Date().toLocaleString()}</td>
                      <td>#{sale.id}</td>
                      <td>{sale.customer || 'Guest'}</td>
                      <td>₹{sale.total || 0}</td>
                      <td style={{ color: '#22c55e' }}>₹{paid}</td>
                      <td style={{ color: due > 0 ? '#ef4444' : 'inherit' }}>₹{due}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                          backgroundColor: status === 'Paid' ? '#dcfce7' : (status === 'Partial' ? '#fef08a' : '#fee2e2'),
                          color: status === 'Paid' ? '#166534' : (status === 'Partial' ? '#854d0e' : '#991b1b')
                        }}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
export default Transactions;
