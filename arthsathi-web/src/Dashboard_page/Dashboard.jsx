import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Overview from './Overview';
import Inventory from './Inventory';
import Customers from './Customers';
import Billing from './Billing';
import Transactions from './Transactions';
import Insights from './Insights';
import Settings from './Settings';
import './Dashboard.css';

function Dashboard() {
  const validTabs = ['Overview', 'Inventory', 'Customers', 'Billing', 'Transactions', 'Insights', 'Settings'];
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('arth_tab');
    return validTabs.includes(saved) ? saved : 'Overview';
  });
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('arth_inv')) || []);
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('arth_cust')) || []);
  const [sales, setSales] = useState(() => JSON.parse(localStorage.getItem('arth_sales')) || []);

  useEffect(() => {
    localStorage.setItem('arth_tab', activeTab);
    localStorage.setItem('arth_inv', JSON.stringify(inventory));
    localStorage.setItem('arth_cust', JSON.stringify(customers));
    localStorage.setItem('arth_sales', JSON.stringify(sales));
  }, [activeTab, inventory, customers, sales]);

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="dashboard-main">
        <Topbar activeTab={activeTab} />
        {activeTab === 'Overview' && <Overview inventory={inventory} sales={sales} />}
        {activeTab === 'Inventory' && <Inventory inventory={inventory} setInventory={setInventory} />}
        {activeTab === 'Customers' && <Customers customers={customers} setCustomers={setCustomers} />}
        {activeTab === 'Billing' && <Billing inventory={inventory} setInventory={setInventory} sales={sales} setSales={setSales} customers={customers} setCustomers={setCustomers} />}
        {activeTab === 'Transactions' && <Transactions sales={sales} />}
        {activeTab === 'Insights' && <Insights sales={sales} />}
        {activeTab === 'Settings' && <Settings setInventory={setInventory} setCustomers={setCustomers} setSales={setSales} setActiveTab={setActiveTab} />}
      </main>
    </div>
  );
}
export default Dashboard;
