import { useMemo } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Lightbulb,
  Percent,
  PieChart,
  Target,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "../context/AppContext";

const MONTH_AXIS = [
  { key: "2025-11", label: "Nov" },
  { key: "2025-12", label: "Dec" },
  { key: "2026-01", label: "Jan" },
  { key: "2026-02", label: "Feb" },
  { key: "2026-03", label: "Mar" },
  { key: "2026-04", label: "Apr" },
];

/** Per spec: “current” month is April 2026 for mock data. */
const THIS_MONTH_KEY = "2026-04";
const LAST_MONTH_KEY = "2026-03";

function monthKey(dateStr) {
  return dateStr.slice(0, 7);
}

function formatInr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatAxisInr(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
  return `₹${n}`;
}

function formatPct(n) {
  if (!Number.isFinite(n)) return "0%";
  return `${n.toFixed(1)}%`;
}

function MonthlyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#334155] bg-[#0f172a] px-3 py-2 text-sm shadow-lg">
      <p className="mb-2 font-medium text-[#f1f5f9]">{label}</p>
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={p.dataKey} className="flex justify-between gap-6 text-[#94a3b8]">
            <span className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: p.color }}
              />
              {p.name}
            </span>
            <span className="font-medium text-[#f1f5f9] tabular-nums">
              {formatInr(p.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  return (
    <div className="rounded-lg border border-[#334155] bg-[#0f172a] px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-[#94a3b8]">{row.payload.category}</p>
      <p className="mt-1 font-semibold text-[#f1f5f9]">
        {formatInr(row.value)}
      </p>
    </div>
  );
}

export default function Insights() {
  const { transactions } = useApp();

  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    const expenseByCategory = {};

    for (const t of transactions) {
      if (t.type === "income") totalIncome += t.amount;
      else {
        totalExpenses += t.amount;
        expenseByCategory[t.category] =
          (expenseByCategory[t.category] || 0) + t.amount;
      }
    }

    let highestSpendCategory = "—";
    let highestSpendAmount = 0;
    for (const [cat, amt] of Object.entries(expenseByCategory)) {
      if (amt > highestSpendAmount) {
        highestSpendAmount = amt;
        highestSpendCategory = cat;
      }
    }

    const sumTypeInMonth = (type, key) =>
      transactions
        .filter(
          (t) => t.type === type && monthKey(t.date) === key
        )
        .reduce((s, t) => s + t.amount, 0);

    const thisMonthExpenses = sumTypeInMonth("expense", THIS_MONTH_KEY);
    const lastMonthExpenses = sumTypeInMonth("expense", LAST_MONTH_KEY);
    const thisMonthIncome = sumTypeInMonth("income", THIS_MONTH_KEY);
    const lastMonthIncome = sumTypeInMonth("income", LAST_MONTH_KEY);

    const avgDailySpend = totalExpenses / 30;

    const savingsRate =
      totalIncome > 0
        ? ((totalIncome - totalExpenses) / totalIncome) * 100
        : 0;

    const monthlyBars = MONTH_AXIS.map(({ key, label }) => {
      const inMonth = transactions.filter((t) => monthKey(t.date) === key);
      const income = inMonth
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const expense = inMonth
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      return { month: label, Income: income, Expenses: expense };
    });

    const categoryRows = Object.entries(expenseByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    const aprilExpenseByCat = {};
    for (const t of transactions) {
      if (t.type !== "expense" || monthKey(t.date) !== THIS_MONTH_KEY)
        continue;
      aprilExpenseByCat[t.category] =
        (aprilExpenseByCat[t.category] || 0) + t.amount;
    }
    let topAprilCategory = "—";
    let topAprilAmount = 0;
    for (const [cat, amt] of Object.entries(aprilExpenseByCat)) {
      if (amt > topAprilAmount) {
        topAprilAmount = amt;
        topAprilCategory = cat;
      }
    }

    const expenseDiffMoM = thisMonthExpenses - lastMonthExpenses;

    return {
      totalIncome,
      totalExpenses,
      highestSpendCategory,
      highestSpendAmount,
      thisMonthExpenses,
      lastMonthExpenses,
      thisMonthIncome,
      lastMonthIncome,
      avgDailySpend,
      savingsRate,
      monthlyBars,
      categoryRows,
      topAprilCategory,
      topAprilAmount,
      expenseDiffMoM,
    };
  }, [transactions]);

  const savingsGood = metrics.savingsRate >= 40;
  const spentMoreThisMonth = metrics.expenseDiffMoM > 0;
  const topCategoryAttention =
    metrics.topAprilAmount > 0 &&
    metrics.thisMonthExpenses > 0 &&
    metrics.topAprilAmount > metrics.thisMonthExpenses / 2;

  return (
    <div className="min-h-full w-full space-y-6 bg-[#0f172a] p-6">
      <div>
        <h1 className="text-xl font-semibold text-[#f1f5f9]">Insights</h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Spending patterns and trends
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
              <Target className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[#64748b]">Highest spend category</p>
              <p className="mt-1 truncate text-lg font-semibold text-[#f1f5f9]">
                {metrics.highestSpendCategory}
              </p>
              <p className="mt-0.5 text-sm font-medium text-[#94a3b8]">
                {formatInr(metrics.highestSpendAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <Percent className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[#64748b]">Savings rate</p>
              <p
                className={`mt-1 text-2xl font-bold tabular-nums ${
                  savingsGood ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatPct(metrics.savingsRate)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
              <Wallet className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[#64748b]">Avg daily spend</p>
              <p className="mt-1 text-lg font-semibold text-[#f1f5f9]">
                {formatInr(metrics.avgDailySpend)}
              </p>
              <p className="mt-0.5 text-xs text-[#64748b]">Based on 30 days</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-5">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                spentMoreThisMonth
                  ? "bg-red-500/15 text-red-400"
                  : "bg-emerald-500/15 text-emerald-400"
              }`}
            >
              {spentMoreThisMonth ? (
                <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
              ) : (
                <ArrowDownRight className="h-5 w-5" strokeWidth={2} />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[#64748b]">This month vs last</p>
              <p className="mt-1 text-lg font-semibold text-[#f1f5f9]">
                {formatInr(Math.abs(metrics.expenseDiffMoM))}
              </p>
              <p className="mt-0.5 text-xs text-[#64748b]">
                {spentMoreThisMonth ? "More than last month" : "Less than last month"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-4">
        <h2 className="mb-1 text-sm font-medium text-[#94a3b8]">
          Monthly comparison
        </h2>
        <div className="mb-4 flex flex-wrap items-center justify-center gap-8 pt-2 text-sm">
          <span className="flex items-center gap-2 text-[#94a3b8]">
            <span
              className="h-3 w-3 rounded-sm bg-[#10b981]"
              aria-hidden
            />
            Income
          </span>
          <span className="flex items-center gap-2 text-[#94a3b8]">
            <span
              className="h-3 w-3 rounded-sm bg-[#ef4444]"
              aria-hidden
            />
            Expenses
          </span>
        </div>
        <div className="h-[320px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics.monthlyBars}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={{ stroke: "#334155" }}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={{ stroke: "#334155" }}
                tickFormatter={formatAxisInr}
              />
              <Tooltip content={<MonthlyTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar
                dataKey="Income"
                name="Income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="Expenses"
                name="Expenses"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-4">
        <div className="mb-4 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-[#64748b]" strokeWidth={2} />
          <h2 className="text-sm font-medium text-[#94a3b8]">
            Category spending breakdown
          </h2>
        </div>
        {metrics.categoryRows.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#64748b]">
            No expense data yet
          </p>
        ) : (
          <div
            className="min-h-[280px] w-full"
            style={{
              height: Math.max(280, metrics.categoryRows.length * 44),
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={metrics.categoryRows}
                margin={{ top: 8, right: 88, left: 8, bottom: 8 }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                  tickFormatter={formatAxisInr}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={100}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={false}
                />
                <Tooltip content={<CategoryTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar
                  dataKey="amount"
                  fill="#10b981"
                  radius={[0, 4, 4, 0]}
                  barSize={22}
                >
                  <LabelList
                    dataKey="amount"
                    position="right"
                    fill="#94a3b8"
                    fontSize={12}
                    formatter={(v) => formatInr(Number(v))}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#64748b]" strokeWidth={2} />
          <h2 className="text-sm font-medium text-[#94a3b8]">
            Insights summary
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div
            className={`rounded-xl border border-[#334155] border-l-4 bg-[#1e293b] p-5 ${
              topCategoryAttention ? "border-l-red-500" : "border-l-emerald-500"
            }`}
          >
            <p className="text-sm leading-relaxed text-[#94a3b8]">
              Your highest expense is{" "}
              <span className="font-semibold text-[#f1f5f9]">
                {metrics.topAprilCategory}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-[#f1f5f9]">
                {formatInr(metrics.topAprilAmount)}
              </span>{" "}
              this month.
            </p>
          </div>

          <div
            className={`rounded-xl border border-[#334155] border-l-4 bg-[#1e293b] p-5 ${
              spentMoreThisMonth ? "border-l-red-500" : "border-l-emerald-500"
            }`}
          >
            <p className="text-sm leading-relaxed text-[#94a3b8]">
              You spent{" "}
              <span className="font-semibold text-[#f1f5f9]">
                {spentMoreThisMonth ? "more" : "less"}
              </span>{" "}
              this month compared to last month by{" "}
              <span className="font-semibold text-[#f1f5f9]">
                {formatInr(Math.abs(metrics.expenseDiffMoM))}
              </span>
              .
            </p>
          </div>

          <div
            className={`rounded-xl border border-[#334155] border-l-4 bg-[#1e293b] p-5 ${
              savingsGood ? "border-l-emerald-500" : "border-l-red-500"
            }`}
          >
            <p className="text-sm leading-relaxed text-[#94a3b8]">
              Your savings rate is{" "}
              <span className="font-semibold text-[#f1f5f9]">
                {formatPct(metrics.savingsRate)}
              </span>{" "}
              —{" "}
              <span className="font-semibold text-[#f1f5f9]">
                {savingsGood ? "good job!" : "needs attention"}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
