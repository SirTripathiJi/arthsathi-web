import React, { useState } from 'react';
import Card from './Card';

function Billing({ inventory, setInventory, sales, setSales }) {
  // Items in the current bill (cart)
  const [cart, setCart] = useState([]);
  
  // Selection state for adding items
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  
  // Bill details (discounts, tax, payments)
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState('');

  // Bill preview state
  const [billPreview, setBillPreview] = useState(null);

  // Simple helper to check stock status
  const checkStockStatus = (item) => {
    const isLow = item.qty <= 5;
    let isExpired = false;

    if (item.expiry) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expDate = new Date(item.expiry);
      expDate.setHours(0, 0, 0, 0);
      if (expDate < today) isExpired = true;
    }
    return { isLow, isExpired };
  };

  // Add an item to the current bill
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!selectedProductId || !quantityInput) return;

    // Find the product in inventory
    const product = inventory.find(p => p.id.toString() === selectedProductId);
    if (!product) return;

    // Safety checks
    if (product.qty <= 0) return alert('Out of stock!');

    const { isExpired } = checkStockStatus(product);
    if (isExpired && !window.confirm('This item is EXPIRED. Add anyway?')) return;

    const requestedQty = Number(quantityInput);
    
    // Check if enough stock exists
    const itemInCart = cart.find(c => c.id === product.id);
    const totalInCart = (itemInCart ? itemInCart.qty : 0) + requestedQty;

    if (product.qty < totalInCart) return alert(`Only ${product.qty} available!`);

    if (itemInCart) {
      // Update existing item in cart
      const updatedCart = cart.map(c => c.id === product.id ? { ...c, qty: totalInCart } : c);
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.sellPrice,
        costPrice: product.costPrice,
        qty: requestedQty
      };
      setCart([...cart, newItem]);
    }

    // Reset inputs
    setSelectedProductId('');
    setQuantityInput('');
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountVal = (subtotal * discountPercent) / 100;
  const taxableVal = subtotal - discountVal;
  const taxVal = (taxableVal * taxPercent) / 100;
  
  const finalTotal = taxableVal + taxVal;
  const finalPaid = paidAmount === '' ? finalTotal : Number(paidAmount);
  const finalDue = Math.max(0, finalTotal - finalPaid);
  const billStatus = finalDue === 0 ? 'Paid' : 'Due';

  // Process the final sale
  const handleGenerateBill = () => {
    if (cart.length === 0) return alert('No items in bill!');

    // 1. Update inventory quantities
    const newInventory = inventory.map(product => {
      const soldItem = cart.find(c => c.id === product.id);
      if (soldItem) {
        return { ...product, qty: product.qty - soldItem.qty };
      }
      return product;
    });
    setInventory(newInventory);

    // 2. Calculate profit for this sale
    const totalCost = cart.reduce((sum, item) => sum + (item.costPrice * item.qty), 0);
    const profit = finalTotal - totalCost;

    // 3. Create the sale record
    const saleRecord = {
      id: Date.now(),
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      total: finalTotal,
      paid: finalPaid,
      due: finalDue,
      status: billStatus,
      paymentMode,
      profit,
      date: new Date().toISOString()
    };
    
    setSales([...sales, saleRecord]);

    // 4. Show preview and reset
    setBillPreview(saleRecord);
    setCart([]);
    setPaidAmount('');
    setDiscountPercent(0);
    setTaxPercent(0);
  };

  return (
    <div className="dash-section">
      <div className="grid-2col no-print">
        {/* Left Card: Item Selection */}
        <Card accentColor="#facc15">
          <h3 style={{ marginBottom: '16px' }}>Add Items to Bill</h3>
          <form className="dash-form" onSubmit={handleAddItem}>
            <select className="dash-input" value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} required>
              <option value="">Select Product</option>
              {inventory.map(p => (
                <option key={p.id} value={p.id} disabled={p.qty <= 0}>
                  {p.name} - ₹{p.sellPrice} ({p.qty} in stock)
                </option>
              ))}
            </select>
            <input className="dash-input" type="number" placeholder="Quantity" value={quantityInput} onChange={e => setQuantityInput(e.target.value)} required />
            <button className="btn" type="submit">Add to Bill</button>
          </form>

          <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Items on Bill</h3>
          {cart.length === 0 ? (
            <p className="empty-state">No items added.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="dash-table">
                <thead>
                  <tr><th>Item</th><th>Qty</th><th>Total</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price * item.qty}</td>
                      <td><button type="button" className="text-btn danger" onClick={() => handleRemoveItem(item.id)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Right Card: Bill Summary */}
        <Card accentColor="#38bdf8">
          <h3 style={{ marginBottom: '16px' }}>Bill Summary</h3>
          <div className="dash-form">
            <div className="billing-info-box">Customer: Walk-in Customer</div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Discount (%)</label>
                <input className="dash-input" type="number" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Tax (%)</label>
                <input className="dash-input" type="number" value={taxPercent} onChange={e => setTaxPercent(Number(e.target.value))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Mode</label>
                <select className="dash-input" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                  <option>Cash</option><option>Card</option><option>UPI</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Paid (₹)</label>
                <input className="dash-input" type="number" placeholder={finalTotal.toFixed(0)} value={paidAmount} onChange={e => setPaidAmount(e.target.value)} />
              </div>
            </div>

            <div className="total-display-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total:</span><span>₹{finalTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: finalDue > 0 ? '#ef4444' : '#22c55e' }}>
                <span>{finalDue > 0 ? 'Due:' : 'Status:'}</span><span>{finalDue > 0 ? `₹${finalDue.toFixed(2)}` : 'Paid'}</span>
              </div>
            </div>

            <button className="btn" type="button" onClick={handleGenerateBill} disabled={cart.length === 0}>Generate Bill</button>
          </div>
        </Card>
      </div>

      {/* Bill Preview Modal */}
      {billPreview && (
        <div className="bill-preview print-area" style={{ marginTop: '24px', maxWidth: '400px', margin: '24px auto' }}>
          <Card accentColor="#111">
            <h2 style={{ textAlign: 'center' }}>Tax Invoice</h2>
            <div style={{ fontSize: '0.9rem', margin: '16px 0' }}>
              <p><strong>Date:</strong> {new Date(billPreview.date).toLocaleString()}</p>
              <p><strong>Bill No:</strong> #{billPreview.id}</p>
            </div>
            <table style={{ width: '100%', fontSize: '0.9rem' }}>
              <thead><tr style={{ textAlign: 'left' }}><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
              <tbody>
                {billPreview.items.map((it, i) => (
                  <tr key={i}><td style={{ padding: '8px 0' }}>{it.name}</td><td>{it.qty}</td><td>₹{it.price}</td></tr>
                ))}
              </tbody>
            </table>
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px dashed var(--grid-color)' }} />
            <div style={{ fontWeight: 'bold' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total:</span><span>₹{billPreview.total.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}><span>Paid:</span><span>₹{billPreview.paid.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', color: '#ef4444' }}><span>Due:</span><span>₹{billPreview.due.toFixed(2)}</span></div>
            </div>
            <button className="btn no-print" style={{ width: '100%', marginTop: '24px' }} onClick={() => window.print()}>Print Bill</button>
            <button className="btn sidebar-btn no-print" style={{ width: '100%', marginTop: '12px' }} onClick={() => setBillPreview(null)}>Close</button>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Billing;
