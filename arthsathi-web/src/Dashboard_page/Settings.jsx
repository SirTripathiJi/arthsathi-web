import React from 'react';
import Card from './Card';

function Settings({ setInventory, setSales, setActiveTab }) {
  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      localStorage.clear();
      setInventory([]);
      setSales([]);
      setActiveTab('Overview');
    }
  };

  return (
    <div className="dash-section">
      <Card accentColor="#111" className="mb-24">
        <h3 style={{ marginBottom: '16px' }}>Danger Zone</h3>
        <p style={{ marginBottom: '16px', color: '#555' }}>Wipe all inventory and sales data from local storage.</p>
        <button className="btn" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#fff' }} onClick={handleReset}>Reset All Data</button>
      </Card>

      <Card accentColor="#38bdf8">
        <h3 style={{ marginBottom: '16px' }}>Support & Contact</h3>
        <p><strong>Phone:</strong> +91 7066863550</p>
        <p><strong>Email:</strong> tripathiakshat2604@gmail.com</p>
      </Card>
    </div>
  );
}
export default Settings;
