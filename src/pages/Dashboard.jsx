import { createElement, useMemo } from "react";
import {
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
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

const PIE_NAMED = ["Food", "Rent", "Transport", "Entertainment", "Utilities"];

const PIE_COLORS = {
  Food: "#10b981",
  Rent: "#3b82f6",
  Transport: "#f59e0b",
  Entertainment: "#8b5cf6",
  Utilities: "#ef4444",
  Others: "#64748b",
};

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
  if (Math.abs(n) >= 100000)
    return `₹${(n / 100000).toFixed(1)}L`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
  return `₹${n}`;
}

function BalanceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  return (
    <div className="rounded-lg border border-[#334155] bg-[#0f172a] px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 font-medium text-[#94a3b8]">{label}</p>
      <p className="font-semibold text-[#f1f5f9]">
        {formatInr(row.value)}
      </p>
    </div>
  );
}

function SummaryCard({ title, amount, badge, icon: Icon, iconClass, badgeTone }) {
  return (
    <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
          >
            {createElement(Icon, {
              className: "h-5 w-5",
              strokeWidth: 2,
            })}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[#64748b]">{title}</p>
            <p className="mt-1 truncate text-lg font-semibold text-[#f1f5f9]">
              {formatInr(amount)}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${badgeTone}`}
        >
          {badge}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { transactions } = useApp();

  const {
    totalIncome,
    totalExpenses,
    totalBalance,
    netSavings,
    monthlyTrend,
    pieRows,
    pieTotal,
  } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    const balance = income - expense;

    const sorted = [...transactions].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    const monthNets = MONTH_AXIS.map(({ key }) =>
      sorted
        .filter((t) => monthKey(t.date) === key)
        .reduce(
          (s, t) => s + (t.type === "income" ? t.amount : -t.amount),
          0
        )
    );
    const cumulativeBalances = monthNets.reduce((acc, net, i) => {
      const prev = i > 0 ? acc[i - 1] : 0;
      acc.push(prev + net);
      return acc;
    }, []);
    const monthlyTrendInner = MONTH_AXIS.map(({ label }, i) => ({
      month: label,
      balance: cumulativeBalances[i],
    }));

    const byCategory = {};
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }

    const pieData = [];
    let othersSum = 0;
    for (const name of PIE_NAMED) {
      const v = byCategory[name];
      if (v) pieData.push({ name, value: v });
    }
    for (const [name, value] of Object.entries(byCategory)) {
      if (!PIE_NAMED.includes(name)) othersSum += value;
    }
    if (othersSum > 0) {
      pieData.push({ name: "Others", value: othersSum });
    }

    const pieTotalInner = pieData.reduce((s, r) => s + r.value, 0);
    const pieRowsInner = pieData.map((row) => ({
      ...row,
      pct: pieTotalInner ? (row.value / pieTotalInner) * 100 : 0,
      color: PIE_COLORS[row.name] || PIE_COLORS.Others,
    }));

    return {
      totalIncome: income,
      totalExpenses: expense,
      totalBalance: balance,
      netSavings: balance,
      monthlyTrend: monthlyTrendInner,
      pieRows: pieRowsInner,
      pieTotal: pieTotalInner,
    };
  }, [transactions]);

  return (
    <div className="min-h-full w-full space-y-6 bg-[#0f172a] p-6">
      <div>
        <h1 className="text-xl font-semibold text-[#f1f5f9]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Overview of your finances
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          amount={totalBalance}
          badge="+12%"
          icon={Wallet}
          iconClass="bg-blue-500/15 text-blue-400"
          badgeTone="bg-blue-500/15 text-blue-300"
        />
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          badge="+8%"
          icon={TrendingUp}
          iconClass="bg-emerald-500/15 text-emerald-400"
          badgeTone="bg-emerald-500/15 text-emerald-300"
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          badge="-3%"
          icon={TrendingDown}
          iconClass="bg-red-500/15 text-red-400"
          badgeTone="bg-red-500/15 text-red-300"
        />
        <SummaryCard
          title="Net Savings"
          amount={netSavings}
          badge="+18%"
          icon={PiggyBank}
          iconClass="bg-amber-500/15 text-amber-400"
          badgeTone="bg-amber-500/15 text-amber-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-4 lg:col-span-3">
          <h2 className="mb-4 text-sm font-medium text-[#94a3b8]">
            Monthly balance trend
          </h2>
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={monthlyTrend}
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
                <Tooltip content={<BalanceTooltip />} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="none"
                  fill="#10b981"
                  fillOpacity={0.15}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#10b981" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-4 lg:col-span-2">
          <h2 className="mb-2 text-sm font-medium text-[#94a3b8]">
            Expenses by category
          </h2>
          <div className="h-[260px] w-full min-w-0">
            {pieTotal > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieRows}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {pieRows.map((row) => (
                      <Cell key={row.name} fill={row.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatInr(value)}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "0.5rem",
                      color: "#94a3b8",
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#64748b]">
                No expense data
              </div>
            )}
          </div>
          {pieTotal > 0 && (
            <ul className="mt-4 space-y-2 border-t border-[#334155] pt-4">
              {pieRows.map((row) => (
                <li
                  key={row.name}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2 text-[#94a3b8]">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: row.color }}
                      aria-hidden
                    />
                    <span className="truncate">{row.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-[#64748b]">
                    {row.pct.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
