import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = ['Overview', 'Inventory', 'Customers', 'Billing', 'Transactions', 'Insights', 'Settings'];
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>ArthSaathi</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {tabs.map(tab => (
            <li 
              key={tab} 
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-bottom">
        <div className="shop-info">
          <strong>ArthSaathi</strong>
          <p>Akshat Tripathi</p>
        </div>
        <button className="btn sidebar-btn" onClick={handleSignOut}>Sign Out</button>
      </div>
    </aside>
  );
}
export default Sidebar;
