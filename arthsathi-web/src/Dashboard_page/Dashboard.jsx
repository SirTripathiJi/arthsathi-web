import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Overview from './Overview';
import Inventory from './Inventory';
import Billing from './Billing';
import Transactions from './Transactions';
import Insights from './Insights';
import Settings from './Settings';
import './Dashboard.css';

// Import local storage helpers
import { getData, saveData } from '../utils/storage';

function Dashboard() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  // Check if user is logged in on page load
  useEffect(() => {
    const user = localStorage.getItem("authUser");
    if (!user) {
      // if no user, send to login page
      navigate('/login');
    } else {
      // if user exists, show dashboard
      setIsAuth(true);
    }

    // Load Dark Mode preference
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
      document.body.classList.add("dark");
    }

    // Cleanup: remove dark mode when leaving dashboard
    return () => {
      document.body.classList.remove("dark");
    };
  }, [navigate]);

  // Main state for the app
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('arth_tab');
    return saved || 'Overview';
  });

  // Load inventory and sales from storage
  const [inventory, setInventory] = useState(() => getData('arth_inv'));
  const [sales, setSales] = useState(() => getData('arth_sales'));

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('arth_tab', activeTab);
    saveData('arth_inv', inventory);
    saveData('arth_sales', sales);
  }, [activeTab, inventory, sales]);

  // Don't render anything if not authenticated
  if (!isAuth) return null;

  return (
    <div className="dashboard-layout">
      {/* Sidebar for navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="dashboard-main">
        {/* Topbar shows current title and theme toggle */}
        <Topbar activeTab={activeTab} />

        {/* Dynamic content based on selected tab */}
        {activeTab === 'Overview' && <Overview inventory={inventory} sales={sales} />}
        {activeTab === 'Inventory' && <Inventory inventory={inventory} setInventory={setInventory} />}
        {activeTab === 'Billing' && <Billing inventory={inventory} setInventory={setInventory} sales={sales} setSales={setSales} />}
        {activeTab === 'Transactions' && <Transactions sales={sales} setSales={setSales} />}
        {activeTab === 'Insights' && <Insights sales={sales} />}
        {activeTab === 'Settings' && <Settings setInventory={setInventory} setSales={setSales} setActiveTab={setActiveTab} />}
      </main>
    </div>
  );
}

export default Dashboard;
