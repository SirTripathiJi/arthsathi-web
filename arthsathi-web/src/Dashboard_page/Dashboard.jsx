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

function Dashboard() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("authUser");
    if (!user) {
      navigate('/login');
    } else {
      setIsAuth(true);
    }

    // Initialize Dark Mode
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
      document.body.classList.add("dark");
    }

    return () => {
      // Clean up dark mode when leaving dashboard if you want it strictly dashboard only
      // but usually users want it to persist. The requirement says "Only for dashboard",
      // so we should remove it when unmounting.
      document.body.classList.remove("dark");
    };
  }, [navigate]);

  const validTabs = ['Overview', 'Inventory', 'Billing', 'Transactions', 'Insights', 'Settings'];
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('arth_tab');
    return validTabs.includes(saved) ? saved : 'Overview';
  });
  const [inventory, setInventory] = useState(() => {
    try { const val = JSON.parse(localStorage.getItem('arth_inv')); return Array.isArray(val) ? val : []; } catch { return []; }
  });
  const [sales, setSales] = useState(() => {
    try { const val = JSON.parse(localStorage.getItem('arth_sales')); return Array.isArray(val) ? val : []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('arth_tab', activeTab);
    localStorage.setItem('arth_inv', JSON.stringify(inventory));
    localStorage.setItem('arth_sales', JSON.stringify(sales));
  }, [activeTab, inventory, sales]);

  if (!isAuth) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="dashboard-main">
        <Topbar activeTab={activeTab} />
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
