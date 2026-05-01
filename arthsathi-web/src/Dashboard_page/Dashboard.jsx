import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Stats from './Stats';
import Inventory from './Inventory';
import Billing from './Billing';
import Insights from './Insights';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const profit = totalSales * 0.25;

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="dashboard-main">
        {activeTab === 'Dashboard' && (
          <>
            <header className="dashboard-header">
              <h1>Dashboard</h1>
              <p>Welcome back! Here is a live overview of your store.</p>
            </header>
            <section className="dashboard-content">
              <Stats 
                sales={totalSales} 
                profit={profit} 
                orders={sales.length} 
                customers={customers.length} 
              />
            </section>
          </>
        )}
        {activeTab === 'Inventory' && (
          <Inventory inventory={inventory} setInventory={setInventory} />
        )}
        {activeTab === 'Billing' && (
          <Billing 
            inventory={inventory} 
            setInventory={setInventory} 
            sales={sales} 
            setSales={setSales} 
            customers={customers}
            setCustomers={setCustomers}
          />
        )}
        {activeTab === 'Insights' && (
          <Insights inventory={inventory} sales={sales} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
