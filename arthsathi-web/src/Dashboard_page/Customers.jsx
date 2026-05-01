import React from 'react';
import Card from './Card';

function Customers({ customers, setCustomers }) {
  const handleDelete = (id) => setCustomers(customers.filter(c => c.id !== id));

  return (
    <div className="dash-section">
      <Card accentColor="#22c55e">
        <h3 style={{ marginBottom: '16px' }}>Customer List</h3>
        {(!customers || customers.length === 0) ? <p className="empty-state">No customers recorded yet. Customers will automatically appear here when you generate a bill.</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Total Spent</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(customers || []).map(c => {
                const now = new Date().getTime();
                const lastVisitTime = c.lastVisit ? new Date(c.lastVisit).getTime() : now;
                const isActive = lastVisitTime > (now - 30*24*60*60*1000);
                return (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.phone || '-'}</td>
                    <td>₹{c.totalSpent || 0}</td>
                    <td>{c.lastVisit ? new Date(c.lastVisit).toLocaleDateString() : '-'}</td>
                    <td><span className={isActive ? 'status-active' : 'status-inactive'}>{isActive ? 'Active' : 'Inactive'}</span></td>
                    <td><button className="text-btn danger" onClick={() => handleDelete(c.id)}>Delete</button></td>
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
export default Customers;
