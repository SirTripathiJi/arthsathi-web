import React, { useState } from 'react';
import Card from './Card';

function Billing({ inventory, setInventory, sales, setSales, customers, setCustomers }) {
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState('');
  
  const [isWalkIn, setIsWalkIn] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [amountPaid, setAmountPaid] = useState('');

  const [previewBill, setPreviewBill] = useState(null);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedItem || !qty) return;
    
    const item = inventory.find(i => i.id.toString() === selectedItem);
    if (!item) return;
    const saleQty = Number(qty);
    
    const existingCartItem = cart.find(c => c.id === item.id);
    const totalQty = (existingCartItem ? existingCartItem.qty : 0) + saleQty;
    
    if (item.qty < totalQty) return alert('Not enough stock!');

    if (existingCartItem) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: totalQty } : c));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.sellPrice || item.price || 0, costPrice: item.costPrice || 0, qty: saleQty }]);
    }
    
    setSelectedItem('');
    setQty('');
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * tax) / 100;
  const total = taxableAmount + taxAmount;
  const paid = amountPaid === '' ? total : Number(amountPaid);
  const due = total - paid;
  const status = due <= 0 ? 'Paid' : (paid > 0 ? 'Partial' : 'Unpaid');

  const handleGenerateBill = () => {
    if (cart.length === 0) return alert('Cart is empty!');
    let finalCustomerName = isWalkIn ? customerName || 'Walk-in Customer' : '';
    let finalCustomerPhone = isWalkIn ? customerPhone : '';

    if (!isWalkIn) {
      const cust = customers.find(c => c.id.toString() === selectedCustomer);
      if (!cust) return alert('Please select a customer.');
      finalCustomerName = cust.name;
      finalCustomerPhone = cust.phone;
    }

    // Deduct stock
    const updatedInventory = [...inventory];
    cart.forEach(cartItem => {
      const invIndex = updatedInventory.findIndex(i => i.id === cartItem.id);
      if (invIndex > -1) updatedInventory[invIndex].qty -= cartItem.qty;
    });
    setInventory(updatedInventory);

    // Calculate profit
    const totalCost = cart.reduce((sum, item) => sum + (item.costPrice * item.qty), 0);
    const profit = total - totalCost; // Net profit after discount/tax
    const date = new Date().toISOString();

    // Handle Customer
    const existingCustIndex = customers.findIndex(c => c.name.toLowerCase() === finalCustomerName.toLowerCase());
    let updatedCustomers = [...customers];
    if (existingCustIndex > -1) {
      updatedCustomers[existingCustIndex].totalSpent = (updatedCustomers[existingCustIndex].totalSpent || 0) + total;
      updatedCustomers[existingCustIndex].lastVisit = date;
      if (finalCustomerPhone) updatedCustomers[existingCustIndex].phone = finalCustomerPhone;
    } else if (finalCustomerName !== 'Walk-in Customer') {
      updatedCustomers.push({ id: Date.now(), name: finalCustomerName, phone: finalCustomerPhone, lastVisit: date, totalSpent: total });
    }
    setCustomers(updatedCustomers);

    // Add Sale
    const newSale = { 
      id: Date.now(), 
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })), 
      customer: finalCustomerName, 
      subtotal, discount, tax, total, paid, due, status, paymentMode,
      profit, date 
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
              {inventory.map(item => (
                <option key={item.id} value={item.id}>{item.name || 'Unnamed'} (₹{item.sellPrice || item.price || 0} - Stock: {item.qty || 0})</option>
              ))}
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
                    <th>Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
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
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ flex: 1 }}>
                <input type="radio" checked={isWalkIn} onChange={() => setIsWalkIn(true)} style={{ marginRight: '8px' }} />
                Walk-in Customer
              </label>
              <label style={{ flex: 1 }}>
                <input type="radio" checked={!isWalkIn} onChange={() => setIsWalkIn(false)} style={{ marginRight: '8px' }} />
                Existing Customer
              </label>
            </div>

            {isWalkIn ? (
              <>
                <input className="dash-input" type="text" placeholder="Customer Name (Optional)" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                <input className="dash-input" type="text" placeholder="Customer Phone (Optional)" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </>
            ) : (
              <select className="dash-input" value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                <option value="">Select Existing Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone || 'No phone'})</option>)}
              </select>
            )}

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', color: '#555' }}>Discount (%)</label>
                <input className="dash-input" type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', color: '#555' }}>Tax/GST (%)</label>
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
                  <option>Due</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', color: '#555' }}>Amount Paid (₹)</label>
                <input className="dash-input" type="number" placeholder={total.toString()} value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
              </div>
            </div>

            <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#22c55e' }}>
                  <span>Discount ({discount}%):</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {tax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ef4444' }}>
                  <span>Tax ({tax}%):</span>
                  <span>+₹{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                <span>Grand Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: due > 0 ? '#ef4444' : '#555' }}>
                <span>Due Amount:</span>
                <span>₹{Math.max(0, due).toFixed(2)}</span>
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
              <p style={{ margin: '4px 0' }}><strong>Customer:</strong> {previewBill.customer}</p>
              <p style={{ margin: '4px 0' }}><strong>Bill No:</strong> #{previewBill.id}</p>
              <p style={{ margin: '4px 0' }}><strong>Payment:</strong> {previewBill.paymentMode} ({previewBill.status})</p>
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
                    <td style={{ padding: '8px 0' }}>{it.name} <br/><span style={{ color: '#555', fontSize: '0.8rem' }}>₹{it.price} each</span></td>
                    <td style={{ padding: '8px 0' }}>{it.qty}</td>
                    <td style={{ padding: '8px 0' }}>₹{it.price * it.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px dashed #ccc' }} />
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Subtotal:</span>
                <span>₹{previewBill.subtotal?.toFixed(2) || previewBill.total.toFixed(2)}</span>
              </div>
              {(previewBill.discount || 0) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Discount ({previewBill.discount}%):</span>
                  <span>-₹{((previewBill.subtotal * previewBill.discount) / 100).toFixed(2)}</span>
                </div>
              )}
              {(previewBill.tax || 0) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Tax ({previewBill.tax}%):</span>
                  <span>+₹{((previewBill.subtotal - ((previewBill.subtotal * previewBill.discount) / 100)) * previewBill.tax / 100).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '12px' }}>
                <span>Total:</span>
                <span>₹{previewBill.total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', color: '#555' }}>
                <span>Paid:</span>
                <span>₹{(previewBill.paid ?? previewBill.total).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', color: '#555' }}>
                <span>Due:</span>
                <span>₹{(previewBill.due ?? 0).toFixed(2)}</span>
              </div>
            </div>
            <button className="btn no-print" style={{ width: '100%', marginTop: '24px' }} onClick={() => window.print()}>Print Bill</button>
            <button className="btn sidebar-btn no-print" style={{ width: '100%', marginTop: '12px', backgroundColor: '#e5e7eb', color: '#111', borderColor: '#d1d5db' }} onClick={() => setPreviewBill(null)}>Close Preview</button>
          </Card>
        </div>
      )}
    </div>
  );
}
export default Billing;
