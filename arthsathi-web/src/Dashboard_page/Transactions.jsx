import React, { useState } from 'react';
import Card from './Card';

function Transactions({ sales, setSales }) {
  // State for filtering by date
  const [dateFilter, setDateFilter] = useState('');
  
  // State for updating a bill with more payment
  const [saleToUpdate, setSaleToUpdate] = useState(null);
  const [newPaymentAmount, setNewPaymentAmount] = useState('');

  // 1. Filter the sales list based on the selected date
  const filteredSales = sales.filter(sale => {
    if (!dateFilter) return true; // show all if no date selected
    
    const saleDate = new Date(sale.date).toISOString().split('T')[0];
    return saleDate === dateFilter;
  });

  // 2. Handle adding more payment to a "Due" bill
  const updatePayment = (e) => {
    e.preventDefault();
    if (!saleToUpdate || !newPaymentAmount) return;

    const extraAmount = Number(newPaymentAmount);
    const updatedPaid = saleToUpdate.paid + extraAmount;
    const updatedDue = Math.max(0, saleToUpdate.due - extraAmount);

    // Update the sales array
    const updatedSalesList = sales.map(s => {
      if (s.id === saleToUpdate.id) {
        return { 
          ...s, 
          paid: updatedPaid, 
          due: updatedDue, 
          status: updatedDue === 0 ? 'Paid' : 'Due' 
        };
      }
      return s;
    });

    setSales(updatedSalesList);
    
    // Close the update form
    setSaleToUpdate(null);
    setNewPaymentAmount('');
  };

  return (
    <div className="dash-section">
      
      {/* Show Update Form only if a bill is selected */}
      {saleToUpdate && (
        <Card accentColor="#ef4444">
          <h3 style={{ marginBottom: '16px' }}>Add Payment for Bill #{saleToUpdate.id}</h3>
          <p style={{ marginBottom: '12px' }}>Current Due: <strong>₹{saleToUpdate.due.toFixed(2)}</strong></p>
          <form className="dash-form" onSubmit={updatePayment}>
            <input 
              className="dash-input" 
              type="number" 
              placeholder="Amount to pay" 
              value={newPaymentAmount} 
              onChange={e => setNewPaymentAmount(e.target.value)} 
              max={saleToUpdate.due}
              required 
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn" type="submit">Update Bill</button>
              <button className="btn sidebar-btn" type="button" onClick={() => setSaleToUpdate(null)} style={{ backgroundColor: '#e5e7eb', color: '#111' }}>Cancel</button>
            </div>
          </form>
        </Card>
      )}

      {/* Main Table Card */}
      <Card accentColor="#38bdf8">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0 }}>Sales History</h3>
          {/* Date Filter Input */}
          <input 
            className="dash-input" 
            type="date" 
            style={{ width: '160px' }} 
            value={dateFilter} 
            onChange={e => setDateFilter(e.target.value)} 
          />
        </div>
        
        {filteredSales.length === 0 ? (
          <p className="empty-state">No sales found for this date.</p>
        ) : (
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
                {/* Reverse the list to show newest first */}
                {[...filteredSales].reverse().map(sale => (
                  <tr key={sale.id} onClick={() => sale.due > 0 && setSaleToUpdate(sale)} style={{ cursor: sale.due > 0 ? 'pointer' : 'default' }}>
                    <td>{new Date(sale.date).toLocaleDateString()}</td>
                    <td>#{sale.id}</td>
                    <td>₹{sale.total.toFixed(2)}</td>
                    <td style={{ color: '#22c55e' }}>₹{sale.paid.toFixed(2)}</td>
                    <td style={{ color: sale.due > 0 ? '#ef4444' : 'inherit' }}>₹{sale.due.toFixed(2)}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
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
