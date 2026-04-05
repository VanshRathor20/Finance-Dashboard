import {
  ArrowLeftRight,
  LayoutDashboard,
  Settings,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const navLinkClass = ({ isActive }) =>
  [
    "flex items-center gap-3 border-l-4 py-2.5 pl-3 pr-2 text-sm font-medium transition-colors",
    isActive
      ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]"
      : "border-transparent text-[#64748b] hover:text-[#94a3b8]",
  ].join(" ");

const accountLinkClass =
  "flex items-center gap-3 border-l-4 border-transparent py-2.5 pl-3 pr-2 text-sm font-medium text-[#64748b] transition-colors hover:text-[#94a3b8]";

export default function Sidebar({ onNavigate }) {
  const { role } = useApp();

  const closeMobile = () => {
    onNavigate?.();
  };

  return (
    <div
      id="app-sidebar"
      className="flex h-full w-full min-h-0 flex-col bg-[#1e293b]"
    >
      <div className="shrink-0 border-b border-[#334155] px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#10b981]/20 text-[#10b981]">
            <Wallet className="h-5 w-5" strokeWidth={2} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-[#10b981]">
            FinTrack
          </span>
        </div>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col px-3 py-5">
        <div className="space-y-1">
          <NavLink
            to="/dashboard"
            className={navLinkClass}
            end
            onClick={closeMobile}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" strokeWidth={2} />
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className={navLinkClass}
            onClick={closeMobile}
          >
            <ArrowLeftRight className="h-5 w-5 shrink-0" strokeWidth={2} />
            Transactions
          </NavLink>
          <NavLink
            to="/insights"
            className={navLinkClass}
            onClick={closeMobile}
          >
            <TrendingUp className="h-5 w-5 shrink-0" strokeWidth={2} />
            Insights
          </NavLink>
        </div>

        <div className="mt-8 border-t border-[#334155] pt-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
            Account
          </p>
          <div className="space-y-1">
            <NavLink
              to="/profile"
              className={accountLinkClass}
              onClick={closeMobile}
            >
              <User className="h-5 w-5 shrink-0" strokeWidth={2} />
              Profile
            </NavLink>
            <NavLink
              to="/settings"
              className={accountLinkClass}
              onClick={closeMobile}
            >
              <Settings className="h-5 w-5 shrink-0" strokeWidth={2} />
              Settings
            </NavLink>
          </div>
        </div>

        <div className="mt-auto shrink-0 border-t border-[#334155] pt-5">
          <div className="flex items-center gap-3 rounded-xl border border-[#334155] bg-[#0f172a]/40 px-3 py-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10b981]/20 text-sm font-semibold text-[#10b981]"
              aria-hidden
            >
              VK
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#94a3b8]">
                Vansh Kumar
              </p>
              <p className="truncate text-xs capitalize text-[#64748b]">
                {role}
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
