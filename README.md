# FinTrack — Finance Dashboard

## Overview

This is a frontend finance dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Recharts**. It allows users to track income and expenses and understand spending patterns at a glance.

---

## Live Demo

Deployed on Netlify : https://finance-dashboard-001.netlify.app/dashboard

---

## Tech Stack

- **React 18** with **Vite**
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router v6** for navigation
- **Context API** + **useState** for state management
- **Lucide React** for icons
  
---

## Features

- Dashboard overview with summary cards and charts
- Balance trend line chart (monthly)
- Spending breakdown donut chart by category
- Full transactions table with search, filter by type and category, sort by date and amount
- Add, edit, and delete transactions (**Admin** only)
- Role-based UI — Admin sees full controls; Viewer sees read-only mode
- Role switcher in the navbar for demonstration
- Insights page with monthly comparison bar chart, category breakdown, and smart observations
- Responsive layout
- Empty state handling when no transactions match filters
  
---

## Setup Instructions

```bash
git clone <repo-url>
cd finance-dashboard
npm install
npm run dev
```

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx
├── data/
│   └── mockData.js
├── components/
│   └── layout/
│       ├── Sidebar.jsx
│       └── Navbar.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   └── Insights.jsx
└── App.jsx
```

---

## Role-Based Access

- **Admin:** Can view all data, add transactions, edit transactions, and delete transactions.
- **Viewer:** Read-only mode — add/edit/delete controls are hidden.

The role can be switched using the dropdown in the top navbar.

---

## Assumptions

- **Mock data** is used instead of a real backend.
- **Roles** are simulated on the frontend for demonstration purposes.
- **Data resets on page refresh** — there is no persistence.

---

## Feedback & Contributions

- If you have suggestions or want to help improve the project
- feel free to open an issue or submit a pull request!

---

## Author
Vansh Rathor
