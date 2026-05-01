import React from 'react';

function Topbar({ activeTab }) {
  const getSubtitle = () => {
    switch (activeTab) {
      case 'Overview': return "Live overview of your store performance.";
      case 'Inventory': return "Manage your stock, categories, and pricing.";
      case 'Customers': return "View and manage your customer relationships.";
      case 'Billing': return "Create bills and record new sales.";
      case 'Transactions': return "View history of all your sales.";
      case 'Insights': return "Detailed charts and business analytics.";
      case 'Settings': return "Manage your account and app data.";
      default: return "";
    }
  };

  return (
    <header className="dashboard-header no-print">
      <h1>{activeTab}</h1>
      <p>{getSubtitle()}</p>
    </header>
  );
}
export default Topbar;
