import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = ['Overview', 'Inventory', 'Billing', 'Transactions', 'Insights', 'Settings'];
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("authUser"));

  const handleSignOut = () => {
    localStorage.removeItem("authUser");
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
          <h3>{user?.shopName || "My Shop"}</h3>
          <p>{user?.username || "User"}</p>
        </div>
        <button className="btn sidebar-btn" onClick={handleSignOut}>Sign Out</button>
      </div>
    </aside>
  );
}
export default Sidebar;
