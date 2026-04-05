export const transactions = [
  // Income (8)
  { id: 1, date: "2025-11-03", description: "Salary Credit", category: "Salary", type: "income", amount: 52000 },
  { id: 2, date: "2025-12-03", description: "Salary Credit", category: "Salary", type: "income", amount: 53000 },
  { id: 3, date: "2026-01-03", description: "Salary Credit", category: "Salary", type: "income", amount: 54000 },
  { id: 4, date: "2026-02-03", description: "Salary Credit", category: "Salary", type: "income", amount: 53500 },
  { id: 5, date: "2026-03-03", description: "Salary Credit", category: "Salary", type: "income", amount: 54500 },
  { id: 6, date: "2026-04-03", description: "Salary Credit", category: "Salary", type: "income", amount: 55000 },
  { id: 7, date: "2026-01-18", description: "Freelance Payment", category: "Freelance", type: "income", amount: 22000 },
  { id: 8, date: "2026-03-10", description: "Freelance Payment", category: "Freelance", type: "income", amount: 18000 },

  // Expenses (17)
  { id: 9, date: "2025-11-05", description: "House Rent", category: "Rent", type: "expense", amount: 8000 },
  { id: 10, date: "2025-11-08", description: "Grocery Store", category: "Food", type: "expense", amount: 2450 },
  { id: 11, date: "2025-11-12", description: "Uber Ride", category: "Transport", type: "expense", amount: 420 },
  { id: 12, date: "2025-11-22", description: "Electricity Bill", category: "Utilities", type: "expense", amount: 1650 },
  { id: 13, date: "2025-12-05", description: "House Rent", category: "Rent", type: "expense", amount: 8000 },
  { id: 14, date: "2025-12-09", description: "Restaurant Dinner", category: "Food", type: "expense", amount: 1850 },
  { id: 15, date: "2025-12-15", description: "Netflix", category: "Entertainment", type: "expense", amount: 799 },
  { id: 16, date: "2025-12-20", description: "Internet Bill", category: "Utilities", type: "expense", amount: 1099 },
  { id: 17, date: "2026-01-05", description: "House Rent", category: "Rent", type: "expense", amount: 8000 },
  { id: 18, date: "2026-01-07", description: "Pharmacy", category: "Healthcare", type: "expense", amount: 640 },
  { id: 19, date: "2026-01-21", description: "Amazon Purchase", category: "Shopping", type: "expense", amount: 3299 },
  { id: 20, date: "2026-02-05", description: "House Rent", category: "Rent", type: "expense", amount: 8000 },
  { id: 21, date: "2026-02-11", description: "Gas Station", category: "Transport", type: "expense", amount: 2850 },
  { id: 22, date: "2026-02-15", description: "Spotify", category: "Entertainment", type: "expense", amount: 599 },
  { id: 23, date: "2026-03-05", description: "House Rent", category: "Rent", type: "expense", amount: 8000 },
  { id: 24, date: "2026-03-09", description: "Doctor Visit", category: "Healthcare", type: "expense", amount: 2200 },
  { id: 25, date: "2026-04-05", description: "Grocery Store", category: "Food", type: "expense", amount: 2750 },
];

export const CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Salary",
  "Freelance",
];

export const ROLES = {
  ADMIN: "admin",
  VIEWER: "viewer",
};

