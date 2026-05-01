import React, { useState } from 'react';
import Card from './Card';

function Inventory({ inventory, setInventory }) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !qty || !price) return;
    setInventory([...inventory, { id: Date.now(), name, qty: Number(qty), price: Number(price) }]);
    setName('');
    setQty('');
    setPrice('');
  };

  return (
    <div className="dash-section">
      <h2 style={{ marginBottom: '24px' }}>Inventory Management</h2>
      <div className="grid-2col">
        <Card accentColor="#38bdf8">
          <h3 style={{ marginBottom: '16px' }}>Add New Item</h3>
          <form className="dash-form" onSubmit={handleAdd}>
            <input className="dash-input" type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="dash-input" type="number" placeholder="Quantity" value={qty} onChange={e => setQty(e.target.value)} required />
            <input className="dash-input" type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required />
            <button className="btn" type="submit">Add Item</button>
          </form>
        </Card>
        
        <Card accentColor="#fb7185">
          <h3 style={{ marginBottom: '16px' }}>Current Stock</h3>
          {inventory.length === 0 ? <p>No items in inventory.</p> : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.price}</td>
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

export default Inventory;
