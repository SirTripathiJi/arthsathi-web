import React, { useState } from 'react';
import Card from './Card';

function Inventory({ inventory, setInventory }) {
  // Simple state for the product form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [qty, setQty] = useState('');
  const [expiry, setExpiry] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  
  // Track if we are editing an existing item
  const [editId, setEditId] = useState(null);

  // Simple state for search
  const [searchTerm, setSearchTerm] = useState('');

  // Function to calculate if an item is low stock or expired
  const getProductStatus = (item) => {
    const isLowStock = item.qty <= 5;
    let expiryStatus = "Safe";

    if (item.expiry) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expDate = new Date(item.expiry);
      expDate.setHours(0, 0, 0, 0);
      
      const diffTime = expDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysLeft < 0) expiryStatus = "Expired";
      else if (daysLeft <= 7) expiryStatus = "Near Expiry";
    }

    return { isLowStock, expiryStatus };
  };

  // Save or Update product
  const handleSaveProduct = (e) => {
    e.preventDefault();

    const productData = {
      id: editId || Date.now(),
      name,
      category,
      qty: Number(qty),
      costPrice: Number(costPrice),
      sellPrice: Number(sellPrice),
      expiry
    };

    if (editId) {
      // Update existing
      const updatedList = inventory.map(item => item.id === editId ? productData : item);
      setInventory(updatedList);
    } else {
      // Add new
      setInventory([...inventory, productData]);
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setQty('');
    setExpiry('');
    setCostPrice('');
    setSellPrice('');
    setEditId(null);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setCategory(item.category);
    setQty(item.qty);
    setExpiry(item.expiry);
    setCostPrice(item.costPrice);
    setSellPrice(item.sellPrice);
  };

  const handleDelete = (id) => {
    const remaining = inventory.filter(item => item.id !== id);
    setInventory(remaining);
  };

  // Filter list based on search term
  const filteredList = inventory.filter(item => {
    const term = searchTerm.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(term);
    const catMatch = item.category.toLowerCase().includes(term);
    return nameMatch || catMatch;
  });

  // Sort list: Expired > Near Expiry > Low Stock
  const sortedList = [...filteredList].sort((a, b) => {
    const statusA = getProductStatus(a);
    const statusB = getProductStatus(b);

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
      {/* Form Card */}
      <Card accentColor="#38bdf8">
        <h3 style={{ marginBottom: '16px' }}>{editId ? 'Edit Product' : 'Add Product'}</h3>
        <form className="dash-form" onSubmit={handleSaveProduct}>
          <div className="grid-2col">
            <input className="dash-input" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="dash-input" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
            <input className="dash-input" type="number" placeholder="Quantity" value={qty} onChange={e => setQty(e.target.value)} required />
            <input className="dash-input" type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
            <input className="dash-input" type="number" placeholder="Cost Price (₹)" value={costPrice} onChange={e => setCostPrice(e.target.value)} required />
            <input className="dash-input" type="number" placeholder="Selling Price (₹)" value={sellPrice} onChange={e => setSellPrice(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" type="submit" style={{ maxWidth: '200px' }}>
              {editId ? 'Save Changes' : 'Add Product'}
            </button>
            {editId && (
              <button className="btn sidebar-btn" type="button" onClick={resetForm} style={{ maxWidth: '200px', backgroundColor: '#e5e7eb', color: '#111', borderColor: '#d1d5db' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>
      
      {/* Table Card */}
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
        
        {sortedList.length === 0 ? (
          <p className="empty-state">No products found.</p>
        ) : (
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
                {sortedList.map(item => {
                  const { isLowStock, expiryStatus } = getProductStatus(item);
                  
                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.sellPrice}</td>
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
