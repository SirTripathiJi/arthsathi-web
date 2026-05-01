import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ activeTab, setActiveTab }) {
  // Navigation tabs list
  const tabs = ['Overview', 'Inventory', 'Billing', 'Transactions', 'Insights', 'Settings'];
  const navigate = useNavigate();

  // Get current logged-in user details
  const userString = localStorage.getItem("authUser");
  const user = userString ? JSON.parse(userString) : null;

  // Function to log out
  const handleSignOut = () => {
    // Clear user session
    localStorage.removeItem("authUser");
    // Go back to login page
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* App Logo */}
      <div className="sidebar-logo">
        <h2>ArthSaathi</h2>
      </div>

      {/* Navigation List */}
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

      {/* User and Shop Info at the bottom */}
      <div className="sidebar-bottom">
        <div className="shop-info">
          <h3>{user?.shopName || "My Store"}</h3>
          <p>{user?.username || "Admin"}</p>
        </div>
        <button className="btn sidebar-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
