import React, { useState } from 'react';
import Card from './Card';

function Inventory({ inventory, setInventory }) {
  const [form, setForm] = useState({ name: '', category: '', qty: '', costPrice: '', sellPrice: '', expiry: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = (e) => {
    e.preventDefault();
    setInventory([...inventory, {
      id: Date.now(),
      name: form.name,
      category: form.category,
      qty: Number(form.qty),
      costPrice: Number(form.costPrice),
      sellPrice: Number(form.sellPrice),
      expiry: form.expiry
    }]);
    setForm({ name: '', category: '', qty: '', costPrice: '', sellPrice: '', expiry: '' });
  };

  const handleDelete = (id) => setInventory(inventory.filter(i => i.id !== id));

  return (
    <div className="dash-section">
      <Card accentColor="#38bdf8" className="mb-24">
        <h3 style={{ marginBottom: '16px' }}>Add Product</h3>
        <form className="dash-form" onSubmit={handleAdd}>
          <div className="grid-2col">
            <input className="dash-input" name="name" type="text" placeholder="Product Name" value={form.name} onChange={handleChange} required />
            <input className="dash-input" name="category" type="text" placeholder="Category" value={form.category} onChange={handleChange} required />
            <input className="dash-input" name="qty" type="number" placeholder="Quantity" value={form.qty} onChange={handleChange} required />
            <input className="dash-input" name="expiry" type="date" value={form.expiry} onChange={handleChange} />
            <input className="dash-input" name="costPrice" type="number" placeholder="Cost Price (₹)" value={form.costPrice} onChange={handleChange} required />
            <input className="dash-input" name="sellPrice" type="number" placeholder="Selling Price (₹)" value={form.sellPrice} onChange={handleChange} required />
          </div>
          <button className="btn" type="submit" style={{ maxWidth: '200px' }}>Add Product</button>
        </form>
      </Card>
      
      <Card accentColor="#fb7185">
        <h3 style={{ marginBottom: '16px' }}>Current Stock</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Cost</th>
                <th>Sell</th>
                <th>Margin</th>
                <th>Expiry</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(inventory || []).map(item => {
                const now = new Date().getTime();
                const cost = item.costPrice || 0;
                const sell = item.sellPrice || item.price || 0;
                const margin = cost > 0 ? (((sell - cost) / cost) * 100).toFixed(1) : 0;
                const isLow = (item.qty || 0) <= 5;
                const isNearExpiry = item.expiry && new Date(item.expiry).getTime() < (now + 7*24*60*60*1000);
                
                return (
                  <tr key={item.id} style={{ backgroundColor: isLow || isNearExpiry ? '#fef2f2' : 'transparent' }}>
                    <td>{item.name || 'Unnamed'} {isLow && <span className="badge-low">LOW</span>}</td>
                    <td>{item.category || 'General'}</td>
                    <td>{item.qty || 0}</td>
                    <td>₹{cost}</td>
                    <td>₹{sell}</td>
                    <td>{margin}%</td>
                    <td>{item.expiry || '-'} {isNearExpiry && <span className="badge-low">SOON</span>}</td>
                    <td><button className="text-btn danger" onClick={() => handleDelete(item.id)}>Delete</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
export default Inventory;
