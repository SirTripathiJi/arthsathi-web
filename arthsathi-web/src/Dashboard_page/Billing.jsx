import React, { useState } from 'react';
import Card from './Card';

function Billing({ inventory, setInventory, sales, setSales, customers, setCustomers }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState('');
  const [customer, setCustomer] = useState('');

  const handleSale = (e) => {
    e.preventDefault();
    if (!selectedItem || !qty || !customer) return;
    
    const itemIndex = inventory.findIndex(i => i.id.toString() === selectedItem);
    if (itemIndex === -1) return;
    
    const item = inventory[itemIndex];
    const saleQty = Number(qty);
    
    if (item.qty < saleQty) {
      alert('Not enough stock available!');
      return;
    }

    const updatedInventory = [...inventory];
    updatedInventory[itemIndex].qty -= saleQty;
    setInventory(updatedInventory);

    const total = saleQty * item.price;
    setSales([...sales, { id: Date.now(), itemName: item.name, qty: saleQty, total, customer }]);
    
    if (!customers.includes(customer)) {
      setCustomers([...customers, customer]);
    }

    setSelectedItem('');
    setQty('');
    setCustomer('');
  };

  return (
    <div className="dash-section">
      <h2 style={{ marginBottom: '24px' }}>Billing & Sales</h2>
      <div className="grid-2col">
        <Card accentColor="#facc15">
          <h3 style={{ marginBottom: '16px' }}>New Sale</h3>
          <form className="dash-form" onSubmit={handleSale}>
            <select className="dash-input" value={selectedItem} onChange={e => setSelectedItem(e.target.value)} required>
              <option value="">Select Item</option>
              {inventory.map(item => (
                <option key={item.id} value={item.id}>{item.name} (₹{item.price} - Qty: {item.qty})</option>
              ))}
            </select>
            <input className="dash-input" type="number" placeholder="Quantity" value={qty} onChange={e => setQty(e.target.value)} required />
            <input className="dash-input" type="text" placeholder="Customer Name" value={customer} onChange={e => setCustomer(e.target.value)} required />
            <button className="btn" type="submit">Complete Sale</button>
          </form>
        </Card>
        
        <Card accentColor="#22c55e">
          <h3 style={{ marginBottom: '16px' }}>Recent Sales</h3>
          {sales.length === 0 ? <p>No sales recorded yet.</p> : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice().reverse().map(sale => (
                  <tr key={sale.id}>
                    <td>{sale.customer}</td>
                    <td>{sale.itemName} x{sale.qty}</td>
                    <td>₹{sale.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Billing;
