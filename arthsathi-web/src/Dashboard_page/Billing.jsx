import React, { useState } from 'react';
import Card from './Card';

function Billing({ inventory, setInventory, sales, setSales }) {
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState('');
  
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [amountPaid, setAmountPaid] = useState('');

  const [previewBill, setPreviewBill] = useState(null);

  const getStatus = (item) => {
    const isLowStock = (item.qty || 0) <= 5;
    let isExpired = false;
    let isNearExpiry = false;

    if (item.expiry) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expDate = new Date(item.expiry);
      expDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) isExpired = true;
      else if (diffDays <= 7) isNearExpiry = true;
    }
    return { isLowStock, isExpired, isNearExpiry };
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedItem || !qty) return;
    
    const item = inventory.find(i => i.id.toString() === selectedItem);
    if (!item) return;

    if (item.qty <= 0) return alert('Cannot sell: This product is out of stock!');
    
    const { isExpired, isNearExpiry } = getStatus(item);
    if (isExpired) {
      if (!window.confirm('WARNING: This product is EXPIRED. Do you still want to add it?')) return;
    } else if (isNearExpiry) {
      if (!window.confirm('Warning: This product is near expiry. Continue?')) return;
    }

    const saleQty = Number(qty);
    const existingCartItem = cart.find(c => c.id === item.id);
    const totalQtyInCart = (existingCartItem ? existingCartItem.qty : 0) + saleQty;
    
    if (item.qty < totalQtyInCart) return alert(`Not enough stock! Only ${item.qty} available.`);

    if (existingCartItem) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: totalQtyInCart } : c));
    } else {
      setCart([...cart, { 
        id: item.id, 
        name: item.name, 
        price: item.sellPrice || 0, 
        costPrice: item.costPrice || 0, 
        qty: saleQty 
      }]);
    }
    
    setSelectedItem('');
    setQty('');
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = (subtotal * (discount || 0)) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * (tax || 0)) / 100;
  const total = taxableAmount + taxAmount;
  const paid = amountPaid === '' ? total : Number(amountPaid);
  const due = Math.max(0, total - paid);
  const status = due === 0 ? 'Paid' : 'Due';

  const handleGenerateBill = () => {
    if (cart.length === 0) return alert('Cart is empty!');

    // Deduct stock
    const updatedInventory = [...inventory];
    cart.forEach(cartItem => {
      const invIndex = updatedInventory.findIndex(i => i.id === cartItem.id);
      if (invIndex > -1) updatedInventory[invIndex].qty -= cartItem.qty;
    });
    setInventory(updatedInventory);

    // Calculate total profit
    const totalCost = cart.reduce((sum, item) => sum + (item.costPrice * item.qty), 0);
    const profit = total - totalCost;

    const date = new Date().toISOString();

    // Add Sale
    const newSale = { 
      id: Date.now(), 
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })), 
      total, paid, due, status, paymentMode, profit, date 
    };
    setSales([...sales, newSale]);

    setPreviewBill(newSale);
    setCart([]);
    setAmountPaid('');
    setDiscount(0);
    setTax(0);
  };

  return (
    <div className="dash-section">
      <div className="grid-2col no-print" style={{ marginBottom: '24px' }}>
        <Card accentColor="#facc15">
          <h3 style={{ marginBottom: '16px' }}>Add Items</h3>
          <form className="dash-form" onSubmit={handleAddToCart}>
            <select className="dash-input" value={selectedItem} onChange={e => setSelectedItem(e.target.value)} required>
              <option value="">Select Product</option>
              {inventory.map(item => {
                const { isLowStock, isExpired } = getStatus(item);
                let label = item.name;
                if (isExpired) label += ' (EXPIRED)';
                else if (item.qty <= 0) label += ' (OUT OF STOCK)';
                else if (isLowStock) label += ' (LOW STOCK)';
                
                return (
                  <option key={item.id} value={item.id} disabled={item.qty <= 0}>
                    {label} - ₹{item.sellPrice || 0}
                  </option>
                );
              })}
            </select>
            <input className="dash-input" type="number" placeholder="Quantity" value={qty} onChange={e => setQty(e.target.value)} required />
            <button className="btn" type="submit">Add to Bill</button>
          </form>

          <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Current Bill</h3>
          {cart.length === 0 ? <p className="empty-state" style={{ padding: '20px 0' }}>No items added yet.</p> : (
            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
              <table className="dash-table" style={{ fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price * item.qty}</td>
                      <td><button type="button" className="text-btn danger" onClick={() => handleRemoveFromCart(item.id)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card accentColor="#38bdf8">
          <h3 style={{ marginBottom: '16px' }}>Bill Details</h3>
          <div className="dash-form">
            <div style={{ padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '500' }}>
              Customer: Walk-in Customer
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', color: '#555' }}>Discount (%)</label>
                <input className="dash-input" type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', color: '#555' }}>Tax (%)</label>
                <input className="dash-input" type="number" value={tax} onChange={e => setTax(Number(e.target.value))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', color: '#555' }}>Payment Mode</label>
                <select className="dash-input" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', color: '#555' }}>Amount Paid (₹)</label>
                <input className="dash-input" type="number" placeholder={total.toString()} value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
              </div>
            </div>

            <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: due > 0 ? '#ef4444' : '#22c55e' }}>
                <span>{due > 0 ? 'Due Amount:' : 'Status:'}</span>
                <span>{due > 0 ? `₹${due.toFixed(2)}` : 'Paid'}</span>
              </div>
            </div>

            <button className="btn" type="button" onClick={handleGenerateBill} disabled={cart.length === 0}>Generate Bill</button>
          </div>
        </Card>
      </div>

      {previewBill && (
        <div className="bill-preview print-area" style={{ marginTop: '24px', maxWidth: '400px', margin: '0 auto' }}>
          <Card accentColor="#111">
            <h2 style={{ textAlign: 'center', marginBottom: '4px' }}>ArthSaathi</h2>
            <p style={{ textAlign: 'center', marginBottom: '24px', color: '#555', fontSize: '0.9rem' }}>Tax Invoice</p>
            <div style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
              <p style={{ margin: '4px 0' }}><strong>Date:</strong> {new Date(previewBill.date).toLocaleString()}</p>
              <p style={{ margin: '4px 0' }}><strong>Bill No:</strong> #{previewBill.id}</p>
              <p style={{ margin: '4px 0' }}><strong>Status:</strong> {previewBill.status}</p>
            </div>
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px dashed #ccc' }} />
            <table style={{ width: '100%', marginBottom: '16px', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {previewBill.items.map((it, i) => (
                  <tr key={i}>
                    <td style={{ padding: '8px 0' }}>{it.name}</td>
                    <td style={{ padding: '8px 0' }}>{it.qty}</td>
                    <td style={{ padding: '8px 0' }}>₹{it.price * it.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px dashed #ccc' }} />
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '12px' }}>
                <span>Total:</span>
                <span>₹{previewBill.total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>Paid:</span>
                <span>₹{previewBill.paid.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', color: previewBill.due > 0 ? '#ef4444' : 'inherit' }}>
                <span>Due:</span>
                <span>₹{previewBill.due.toFixed(2)}</span>
              </div>
            </div>
            <button className="btn no-print" style={{ width: '100%', marginTop: '24px' }} onClick={() => window.print()}>Print Bill</button>
            <button className="btn sidebar-btn no-print" style={{ width: '100%', marginTop: '12px', backgroundColor: '#e5e7eb', color: '#111', borderColor: '#d1d5db' }} onClick={() => setPreviewBill(null)}>Close</button>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Billing;
