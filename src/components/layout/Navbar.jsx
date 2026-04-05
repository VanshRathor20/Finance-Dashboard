import { useEffect, useRef, useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const NOTIFICATIONS = [
  "Rent payment of ₹8,500 due tomorrow",
  "You have exceeded your Food budget this month",
  "New transaction added successfully",
];

function breadcrumbForPath(pathname) {
  if (pathname.startsWith("/dashboard")) {
    return { section: "Dashboard", page: "Overview" };
  }
  if (pathname.startsWith("/transactions")) {
    return { section: "Transactions", page: "All" };
  }
  if (pathname.startsWith("/insights")) {
    return { section: "Insights", page: "Summary" };
  }
  if (pathname.startsWith("/profile")) {
    return { section: "Account", page: "Profile" };
  }
  if (pathname.startsWith("/settings")) {
    return { section: "Account", page: "Settings" };
  }
  return { section: "Dashboard", page: "Overview" };
}

export default function Navbar({
  onToggleMobileSidebar,
  mobileSidebarOpen = false,
}) {
  const { pathname } = useLocation();
  const { role, setRole, filters, setFilters } = useApp();
  const { section, page } = breadcrumbForPath(pathname);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifContainerRef = useRef(null);

  useEffect(() => {
    if (!notifOpen) return;
    function handlePointerDown(e) {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [notifOpen]);

  return (
    <header
      className="flex h-[60px] w-full shrink-0 items-center gap-3 border-b border-[#334155] bg-[#0f172a] px-4 md:gap-4 md:px-6"
      role="banner"
    >
      <button
        type="button"
        onClick={onToggleMobileSidebar}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#334155] bg-[#1e293b] text-[#94a3b8] transition-colors hover:bg-[#334155]/40 hover:text-[#f1f5f9] md:hidden"
        aria-label={mobileSidebarOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileSidebarOpen}
        aria-controls="app-sidebar"
      >
        <Menu className="h-5 w-5" strokeWidth={2} />
      </button>

      <nav
        className="min-w-0 flex-1 truncate text-xs sm:text-sm"
        aria-label="Breadcrumb"
      >
        <span className="text-[#94a3b8]">{section}</span>
        <span className="text-[#94a3b8]"> / </span>
        <span className="font-medium text-[#f1f5f9]">{page}</span>
      </nav>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <input
          type="search"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="hidden h-9 w-[200px] shrink-0 rounded-lg border border-[#334155] bg-[#1e293b] px-3 text-sm text-[#94a3b8] placeholder:text-[#64748b] outline-none focus:border-[#475569] focus:ring-1 focus:ring-[#475569] md:block"
          aria-label="Search transactions"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-9 max-w-[5.5rem] min-w-0 shrink cursor-pointer rounded-lg border border-[#334155] bg-[#1e293b] px-2 text-xs text-[#94a3b8] outline-none focus:border-[#475569] focus:ring-1 focus:ring-[#475569] sm:max-w-none sm:min-w-30 sm:px-3 sm:text-sm"
          aria-label="Role"
        >
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        <div className="relative" ref={notifContainerRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#334155] bg-[#1e293b] text-[#94a3b8] transition-colors hover:bg-[#334155]/40 hover:text-[#f1f5f9] data-[open=true]:border-[#10b981]/50"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            data-open={notifOpen}
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
          </button>
          {notifOpen && (
            <div
              className="absolute right-0 top-full z-[60] mt-2 w-80 max-w-[calc(100vw-3rem)] rounded-xl border border-[#334155] bg-[#1e293b] py-2 shadow-xl"
              role="menu"
            >
              <p className="border-b border-[#334155] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                Notifications
              </p>
              <ul className="max-h-72 overflow-y-auto py-1">
                {NOTIFICATIONS.map((text, i) => (
                  <li
                    key={i}
                    className="border-b border-[#334155]/60 px-4 py-3 text-sm text-[#94a3b8] last:border-0 hover:bg-[#0f172a]/60"
                    role="menuitem"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
