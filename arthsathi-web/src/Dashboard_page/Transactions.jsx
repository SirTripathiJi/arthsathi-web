import React, { useState } from 'react';
import Card from './Card';

function Transactions({ sales, setSales }) {
  const [filterDate, setFilterDate] = useState('');
  
  const [updatingSale, setUpdatingSale] = useState(null);
  const [payAmount, setPayAmount] = useState('');

  let filteredSales = (sales || []).filter(s => {
    const matchesDate = filterDate ? (s.date && new Date(s.date).toISOString().split('T')[0] === filterDate) : true;
    return matchesDate;
  });

  const handleUpdatePayment = (e) => {
    e.preventDefault();
    if (!updatingSale || !payAmount) return;

    const amount = Number(payAmount);
    const newPaid = updatingSale.paid + amount;
    const newDue = Math.max(0, updatingSale.due - amount);

    // Update Sales
    setSales(sales.map(s => s.id === updatingSale.id ? { 
      ...s, 
      paid: newPaid, 
      due: newDue, 
      status: newDue === 0 ? 'Paid' : 'Due' 
    } : s));

    setUpdatingSale(null);
    setPayAmount('');
  };

  return (
    <div className="dash-section">
      {updatingSale && (
        <Card accentColor="#ef4444">
          <h3 style={{ marginBottom: '16px' }}>Update Payment for Bill #{updatingSale.id}</h3>
          <p style={{ marginBottom: '12px' }}>Remaining Due: <strong>₹{updatingSale.due.toFixed(2)}</strong></p>
          <form className="dash-form" onSubmit={handleUpdatePayment}>
            <input 
              className="dash-input" 
              type="number" 
              placeholder="Enter Payment Amount" 
              value={payAmount} 
              onChange={e => setPayAmount(e.target.value)} 
              max={updatingSale.due}
              required 
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn" type="submit">Update Bill</button>
              <button className="btn sidebar-btn" type="button" onClick={() => setUpdatingSale(null)} style={{ backgroundColor: '#e5e7eb', color: '#111', borderColor: '#d1d5db' }}>Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <Card accentColor="#38bdf8">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0 }}>Sales History</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input className="dash-input" type="date" style={{ width: '160px' }} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          </div>
        </div>
        
        {filteredSales.length === 0 ? <p className="empty-state">No transactions found.</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bill #</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice().reverse().map(sale => (
                  <tr key={sale.id} onClick={() => sale.due > 0 && setUpdatingSale(sale)} style={{ cursor: sale.due > 0 ? 'pointer' : 'default' }}>
                    <td>{sale.date ? new Date(sale.date).toLocaleDateString() : '-'}</td>
                    <td>#{sale.id}</td>
                    <td>₹{sale.total?.toFixed(2)}</td>
                    <td style={{ color: '#22c55e' }}>₹{sale.paid?.toFixed(2)}</td>
                    <td style={{ color: sale.due > 0 ? '#ef4444' : 'inherit' }}>₹{sale.due?.toFixed(2)}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                        backgroundColor: sale.status === 'Paid' ? '#dcfce7' : '#fee2e2',
                        color: sale.status === 'Paid' ? '#166534' : '#991b1b'
                      }}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Transactions;
