import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = ['Dashboard', 'Inventory', 'Billing', 'Insights'];
  
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
    </aside>
  );
}

export default Sidebar;
