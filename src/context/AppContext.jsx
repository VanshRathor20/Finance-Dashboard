/* eslint-disable react-refresh/only-export-components -- context + hook module */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ROLES, transactions as initialTransactions } from "../data/mockData";

const AppContext = createContext(null);

function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(
    () => [...initialTransactions]
  );
  const [role, setRole] = useState(ROLES.ADMIN);
  const [filters, setFiltersState] = useState({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date-desc",
  });

  const setFilters = useCallback((newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const addTransaction = useCallback((txn) => {
    setTransactions((prev) => {
      const nextId = prev.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      return [...prev, { ...txn, id: nextId }];
    });
  }, []);

  const editTransaction = useCallback((id, updatedTxn) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updatedTxn, id: t.id } : t
      )
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      transactions,
      role,
      filters,
      setRole,
      setFilters,
      addTransaction,
      editTransaction,
      deleteTransaction,
    }),
    [
      transactions,
      role,
      filters,
      setFilters,
      addTransaction,
      editTransaction,
      deleteTransaction,
    ]
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export default AppProvider;
