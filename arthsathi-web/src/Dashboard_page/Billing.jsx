import React, { useState } from 'react';
import Card from './Card';

function Billing({ inventory, setInventory, sales, setSales, customers, setCustomers }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [previewBill, setPreviewBill] = useState(null);

  const handleSale = (e) => {
    e.preventDefault();
    if (!selectedItem || !qty || !customerName) return;
    
    const itemIndex = inventory.findIndex(i => i.id.toString() === selectedItem);
    if (itemIndex === -1) return;
    const item = inventory[itemIndex];
    const saleQty = Number(qty);
    
    if (item.qty < saleQty) return alert('Not enough stock!');

    // Deduct stock
    const updatedInventory = [...inventory];
    updatedInventory[itemIndex].qty -= saleQty;
    setInventory(updatedInventory);

    const sell = item.sellPrice || item.price || 0;
    const cost = item.costPrice || 0;
    const total = saleQty * sell;
    const profit = (sell - cost) * saleQty;
    const date = new Date().toISOString();

    // Handle Customer
    const existingCustIndex = customers.findIndex(c => c.name.toLowerCase() === customerName.toLowerCase());
    let updatedCustomers = [...customers];
    if (existingCustIndex > -1) {
      updatedCustomers[existingCustIndex].totalSpent = (updatedCustomers[existingCustIndex].totalSpent || 0) + total;
      updatedCustomers[existingCustIndex].lastVisit = date;
      if (customerPhone) updatedCustomers[existingCustIndex].phone = customerPhone;
    } else {
      updatedCustomers.push({ id: Date.now(), name: customerName, phone: customerPhone, lastVisit: date, totalSpent: total });
    }
    setCustomers(updatedCustomers);

    // Add Sale
    const newSale = { id: Date.now(), items: [{ name: item.name, qty: saleQty, price: sell }], customer: customerName, total, profit, date };
    setSales([...sales, newSale]);

    setPreviewBill(newSale);
    setSelectedItem('');
    setQty('');
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <div className="dash-section">
      <div className="grid-2col no-print">
        <Card accentColor="#facc15">
          <h3 style={{ marginBottom: '16px' }}>New Sale</h3>
          <form className="dash-form" onSubmit={handleSale}>
            <select className="dash-input" value={selectedItem} onChange={e => setSelectedItem(e.target.value)} required>
              <option value="">Select Product</option>
              {inventory.map(item => (
                <option key={item.id} value={item.id}>{item.name} (₹{item.sellPrice} - Stock: {item.qty})</option>
              ))}
            </select>
            <input className="dash-input" type="number" placeholder="Quantity" value={qty} onChange={e => setQty(e.target.value)} required />
            <input className="dash-input" type="text" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
            <input className="dash-input" type="text" placeholder="Customer Phone (Optional)" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
            <button className="btn" type="submit">Generate Bill</button>
          </form>
        </Card>
      </div>

      {previewBill && (
        <div className="bill-preview print-area" style={{ marginTop: '24px', maxWidth: '400px' }}>
          <Card accentColor="#111">
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>ArthSaathi</h2>
            <p style={{ textAlign: 'center', marginBottom: '24px', color: '#555' }}>Tax Invoice</p>
            <p><strong>Date:</strong> {new Date(previewBill.date).toLocaleString()}</p>
            <p><strong>Customer:</strong> {previewBill.customer}</p>
            <p><strong>Bill No:</strong> #{previewBill.id}</p>
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px dashed #ccc' }} />
            <table style={{ width: '100%', marginBottom: '16px' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {previewBill.items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.name}</td>
                    <td>{it.qty}</td>
                    <td>₹{it.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px dashed #ccc' }} />
            <h3 style={{ textAlign: 'right' }}>Total: ₹{previewBill.total}</h3>
            <button className="btn no-print" style={{ width: '100%', marginTop: '24px' }} onClick={() => window.print()}>Print Bill</button>
          </Card>
        </div>
      )}
    </div>
  );
}
export default Billing;
