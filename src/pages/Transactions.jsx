import { useMemo, useState } from "react";
import { Inbox, Pencil, Trash2 } from "lucide-react";
import { CATEGORIES, ROLES } from "../data/mockData";
import { useApp } from "../context/AppContext";

const TYPE_FILTER_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "date-desc" },
  { label: "Oldest First", value: "date-asc" },
  { label: "Amount High to Low", value: "amount-desc" },
  { label: "Amount Low to High", value: "amount-asc" },
];

const CATEGORY_BADGE_STYLES = {
  Food: "bg-emerald-500/15 text-emerald-300",
  Rent: "bg-blue-500/15 text-blue-300",
  Transport: "bg-amber-500/15 text-amber-300",
  Entertainment: "bg-violet-500/15 text-violet-300",
  Utilities: "bg-red-500/15 text-red-300",
  Healthcare: "bg-cyan-500/15 text-cyan-300",
  Shopping: "bg-pink-500/15 text-pink-300",
  Salary: "bg-green-500/15 text-green-300",
  Freelance: "bg-teal-500/15 text-teal-300",
};

function formatDisplayDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatInrAmount(n) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(n);
}

function emptyForm() {
  return {
    description: "",
    amount: "",
    category: CATEGORIES[0] ?? "Food",
    type: "expense",
    date: new Date().toISOString().slice(0, 10),
  };
}

function selectClassName() {
  return "h-10 rounded-lg border border-[#334155] bg-[#0f172a] px-3 text-sm text-[#94a3b8] outline-none focus:border-[#475569] focus:ring-1 focus:ring-[#475569]";
}

function inputClassName() {
  return "h-10 w-full rounded-lg border border-[#334155] bg-[#0f172a] px-3 text-sm text-[#94a3b8] placeholder:text-[#64748b] outline-none focus:border-[#475569] focus:ring-1 focus:ring-[#475569]";
}

export default function Transactions() {
  const {
    transactions,
    role,
    filters,
    setFilters,
    addTransaction,
    editTransaction,
    deleteTransaction,
  } = useApp();

  const isAdmin = role === ROLES.ADMIN;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => emptyForm());

  const filteredSorted = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    let list = transactions.filter((t) => {
      if (q && !t.description.toLowerCase().includes(q)) return false;
      if (filters.type !== "all" && t.type !== filters.type) return false;
      if (filters.category !== "all" && t.category !== filters.category)
        return false;
      return true;
    });

    const sorted = [...list];
    switch (filters.sortBy) {
      case "date-asc":
        sorted.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "amount-desc":
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      case "amount-asc":
        sorted.sort((a, b) => a.amount - b.amount);
        break;
      case "date-desc":
      default:
        sorted.sort((a, b) => b.date.localeCompare(a.date));
        break;
    }
    return sorted;
  }, [transactions, filters]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEditModal(txn) {
    setEditingId(txn.id);
    setForm({
      description: txn.description,
      amount: String(txn.amount),
      category: txn.category,
      type: txn.type,
      date: txn.date,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  }

  function handleSave(e) {
    e.preventDefault();
    const description = form.description.trim();
    const amount = Number(form.amount);
    if (!description || !Number.isFinite(amount) || amount < 0) return;

    const payload = {
      description,
      amount,
      category: form.category,
      type: form.type,
      date: form.date,
    };

    if (editingId != null) {
      editTransaction(editingId, payload);
    } else {
      addTransaction(payload);
    }
    closeModal();
  }

  function handleDelete(id) {
    if (window.confirm("Delete this transaction?")) {
      deleteTransaction(id);
    }
  }

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-full w-full bg-[#0f172a] p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#f1f5f9]">Transactions</h1>
        <p className="mt-1 text-sm text-[#64748b]">
          View and manage your activity
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="w-full min-w-[160px] sm:w-48">
            <label className="mb-1 block text-xs font-medium text-[#64748b]">
              Search
            </label>
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Search description..."
              className={inputClassName()}
              aria-label="Search transactions by description"
            />
          </div>
          <div className="w-full min-w-[140px] sm:w-40">
            <label className="mb-1 block text-xs font-medium text-[#64748b]">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value })}
              className={`w-full ${selectClassName()}`}
              aria-label="Filter by type"
            >
              {TYPE_FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full min-w-[160px] sm:w-44">
            <label className="mb-1 block text-xs font-medium text-[#64748b]">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
              className={`w-full ${selectClassName()}`}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full min-w-[180px] sm:w-52">
            <label className="mb-1 block text-xs font-medium text-[#64748b]">
              Sort
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value })}
              className={`w-full ${selectClassName()}`}
              aria-label="Sort transactions"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#10b981] px-4 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#34d399]"
          >
            + Add Transaction
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#334155] bg-[#1e293b]">
        {filteredSorted.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <Inbox
              className="h-14 w-14 text-[#334155]"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="text-sm font-medium text-[#64748b]">
              No transactions found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#334155] bg-[#0f172a]/50">
                  <th className="px-4 py-3 font-medium text-[#64748b]">
                    Date
                  </th>
                  <th className="px-4 py-3 font-medium text-[#64748b]">
                    Description
                  </th>
                  <th className="px-4 py-3 font-medium text-[#64748b]">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium text-[#64748b]">Type</th>
                  <th className="px-4 py-3 text-right font-medium text-[#64748b]">
                    Amount
                  </th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-right font-medium text-[#64748b]">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredSorted.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-[#334155]/80 last:border-0 hover:bg-[#0f172a]/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-[#94a3b8]">
                      {formatDisplayDate(t.date)}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-[#f1f5f9]">
                      {t.description}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          CATEGORY_BADGE_STYLES[t.category] ??
                          "bg-[#334155] text-[#94a3b8]"
                        }`}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          t.type === "income"
                            ? "inline-flex rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400"
                            : "inline-flex rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-400"
                        }
                      >
                        {t.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums ${
                        t.type === "income"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {formatInrAmount(t.amount)}
                    </td>
                    {isAdmin && (
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(t)}
                            className="rounded-lg p-2 text-[#64748b] transition-colors hover:bg-[#334155] hover:text-[#f1f5f9]"
                            aria-label="Edit transaction"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(t.id)}
                            className="rounded-lg p-2 text-[#64748b] transition-colors hover:bg-red-500/10 hover:text-red-400"
                            aria-label="Delete transaction"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#334155] bg-[#1e293b] p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="txn-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="txn-modal-title"
              className="text-lg font-semibold text-[#f1f5f9]"
            >
              {editingId != null ? "Edit transaction" : "Add transaction"}
            </h2>
            <form className="mt-5 space-y-4" onSubmit={handleSave}>
              <div>
                <label
                  htmlFor="txn-desc"
                  className="mb-1 block text-xs font-medium text-[#64748b]"
                >
                  Description
                </label>
                <input
                  id="txn-desc"
                  type="text"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  className={inputClassName()}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="txn-amt"
                  className="mb-1 block text-xs font-medium text-[#64748b]"
                >
                  Amount
                </label>
                <input
                  id="txn-amt"
                  type="number"
                  min={0}
                  step={1}
                  value={form.amount}
                  onChange={(e) => updateForm("amount", e.target.value)}
                  className={inputClassName()}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="txn-cat"
                  className="mb-1 block text-xs font-medium text-[#64748b]"
                >
                  Category
                </label>
                <select
                  id="txn-cat"
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className={inputClassName()}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="txn-type"
                  className="mb-1 block text-xs font-medium text-[#64748b]"
                >
                  Type
                </label>
                <select
                  id="txn-type"
                  value={form.type}
                  onChange={(e) => updateForm("type", e.target.value)}
                  className={inputClassName()}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="txn-date"
                  className="mb-1 block text-xs font-medium text-[#64748b]"
                >
                  Date
                </label>
                <input
                  id="txn-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => updateForm("date", e.target.value)}
                  className={inputClassName()}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-lg border border-[#334155] bg-transparent px-4 text-sm font-medium text-[#94a3b8] transition-colors hover:bg-[#334155]/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#10b981] px-4 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#34d399]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
