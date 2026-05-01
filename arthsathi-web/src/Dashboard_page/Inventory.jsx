import React, { useState } from 'react';
import Card from './Card';

function Inventory({ inventory, setInventory }) {
  const [form, setForm] = useState({ id: null, name: '', category: '', qty: '', costPrice: '', sellPrice: '', expiry: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const LOW_STOCK_LIMIT = 5;

  const getStatus = (item) => {
    const isLowStock = (item.qty || 0) <= LOW_STOCK_LIMIT;
    let expiryStatus = "Safe";
    let daysLeft = null;

    if (item.expiry) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expDate = new Date(item.expiry);
      expDate.setHours(0, 0, 0, 0);
      
      const diffTime = expDate.getTime() - today.getTime();
      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysLeft < 0) expiryStatus = "Expired";
      else if (daysLeft <= 7) expiryStatus = "Near Expiry";
    }

    return { isLowStock, expiryStatus, daysLeft };
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    if (form.id) {
      setInventory(inventory.map(item => item.id === form.id ? { ...item, ...form, qty: Number(form.qty), costPrice: Number(form.costPrice), sellPrice: Number(form.sellPrice) } : item));
    } else {
      setInventory([...inventory, {
        id: Date.now(),
        name: form.name,
        category: form.category,
        qty: Number(form.qty),
        costPrice: Number(form.costPrice),
        sellPrice: Number(form.sellPrice),
        expiry: form.expiry
      }]);
    }
    setForm({ id: null, name: '', category: '', qty: '', costPrice: '', sellPrice: '', expiry: '' });
  };

  const handleEdit = (item) => {
    setForm({ ...item, qty: item.qty.toString(), costPrice: item.costPrice.toString(), sellPrice: item.sellPrice.toString() });
  };

  const handleDelete = (id) => setInventory(inventory.filter(i => i.id !== id));

  // Filtering by search term
  const filteredInventory = (inventory || []).filter(item => {
    const term = searchTerm.toLowerCase();
    return (item.name || '').toLowerCase().includes(term) || (item.category || '').toLowerCase().includes(term);
  });

  // Sorting: Expired first → Near Expiry → Low Stock → Others
  const sortedInventory = filteredInventory.sort((a, b) => {
    const statusA = getStatus(a);
    const statusB = getStatus(b);

    const getRank = (s) => {
      if (s.expiryStatus === "Expired") return 1;
      if (s.expiryStatus === "Near Expiry") return 2;
      if (s.isLowStock) return 3;
      return 4;
    };

    return getRank(statusA) - getRank(statusB);
  });

  return (
    <div className="dash-section">
      <Card accentColor="#38bdf8">
        <h3 style={{ marginBottom: '16px' }}>{form.id ? 'Edit Product' : 'Add Product'}</h3>
        <form className="dash-form" onSubmit={handleSave}>
          <div className="grid-2col">
            <input className="dash-input" name="name" type="text" placeholder="Product Name" value={form.name} onChange={handleChange} required />
            <input className="dash-input" name="category" type="text" placeholder="Category" value={form.category} onChange={handleChange} required />
            <input className="dash-input" name="qty" type="number" placeholder="Quantity" value={form.qty} onChange={handleChange} required />
            <input className="dash-input" name="expiry" type="date" value={form.expiry} onChange={handleChange} />
            <input className="dash-input" name="costPrice" type="number" placeholder="Cost Price (₹)" value={form.costPrice} onChange={handleChange} required />
            <input className="dash-input" name="sellPrice" type="number" placeholder="Selling Price (₹)" value={form.sellPrice} onChange={handleChange} required />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" type="submit" style={{ maxWidth: '200px' }}>{form.id ? 'Save Changes' : 'Add Product'}</button>
            {form.id && <button className="btn sidebar-btn" type="button" onClick={() => setForm({ id: null, name: '', category: '', qty: '', costPrice: '', sellPrice: '', expiry: '' })} style={{ maxWidth: '200px', backgroundColor: '#e5e7eb', color: '#111', borderColor: '#d1d5db' }}>Cancel</button>}
          </div>
        </form>
      </Card>
      
      <Card accentColor="#fb7185">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ margin: 0 }}>Current Stock</h3>
          <input 
            type="text" 
            className="dash-input" 
            placeholder="Search" 
            style={{ maxWidth: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {sortedInventory.length === 0 ? <p className="empty-state">No products found. {inventory.length === 0 ? 'Add your first product above to get started.' : 'Try a different search term.'}</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Sell Price</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedInventory.map(item => {
                  const { isLowStock, expiryStatus } = getStatus(item);
                  
                  return (
                    <tr key={item.id}>
                      <td>{item.name || 'Unnamed'}</td>
                      <td>{item.category || 'General'}</td>
                      <td>{item.qty || 0}</td>
                      <td>₹{item.sellPrice || 0}</td>
                      <td>{item.expiry || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {isLowStock && <span className="badge-low" style={{ margin: 0 }}>LOW STOCK</span>}
                          {expiryStatus === "Expired" && <span className="badge-status badge-expired" style={{ margin: 0 }}>EXPIRED</span>}
                          {expiryStatus === "Near Expiry" && <span className="badge-status badge-near" style={{ margin: 0 }}>NEAR EXPIRY</span>}
                          {!isLowStock && expiryStatus === "Safe" && <span className="badge-status badge-good" style={{ margin: 0 }}>GOOD</span>}
                        </div>
                      </td>
                      <td>
                        <button className="text-btn edit" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="text-btn danger" onClick={() => handleDelete(item.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
export default Inventory;
