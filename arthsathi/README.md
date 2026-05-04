ArthSaathi

ArthSaathi is a browser-based inventory management and billing system built for small shop owners. It provides a straightforward way to manage stock, generate bills, and track daily business activity without relying on any backend or external service.

Overview

The application combines inventory tracking, billing, and basic analytics into a single dashboard. All operations are handled locally in the browser, which keeps the system fast and simple to use. The interface focuses on clarity and usability, making it easy to manage day-to-day shop operations without unnecessary complexity.

Features
Inventory Management
Add, update, and manage products with category, pricing, and expiry details.
Billing System
Create invoices with multiple items, adjust quantities, and generate totals instantly.
Financial Calculations
Automatically calculates totals, discounts, taxes, and pending dues.
Stock Monitoring
Highlights low stock items, near-expiry products, and expired inventory.
Transaction History
Maintains a record of all sales with date-based filtering.
Insights
Displays basic charts for revenue trends and product performance.
Theme Support
Includes light and dark modes for better usability.
Local Data Storage
Stores all data in the browser using localStorage, allowing offline usage.
Tech Stack
React
React Router
Recharts
Tailwind CSS
Local Storage
Vite
Folder Structure
src/
  Dashboard_page/
  landing_page/
  login_page/
  utils/
  assets/
How It Works
Adding Products
Products are added through the inventory section with cost price, selling price, and optional expiry date.
Managing Stock
The system evaluates stock levels automatically and flags items that require attention.
Creating Bills
Items can be selected from inventory, quantities adjusted, and totals are calculated in real time.
Updating Records
Once a bill is created, stock is updated and the transaction is stored automatically.
Viewing Insights
Sales data is used to generate simple visual summaries for revenue and product trends.
Setup Instructions
Clone the repository
Run npm install to install dependencies
Run npm run dev to start the development server
Open the local URL in your browser
Data Storage

All data is stored in the browser using localStorage. No external database or backend is used. Data remains available across sessions but will be cleared if browser storage is manually removed.

Future Improvements
Cloud-based data sync
User authentication and roles
Barcode-based billing
Export reports (PDF / Excel)