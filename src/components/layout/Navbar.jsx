import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

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
  return { section: "Dashboard", page: "Overview" };
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { role, setRole } = useApp();
  const { section, page } = breadcrumbForPath(pathname);

  return (
    <header
      className="flex h-[60px] w-full shrink-0 items-center justify-between gap-4 border-b border-[#334155] bg-[#0f172a] px-6"
      role="banner"
    >
      <nav
        className="min-w-0 truncate text-sm"
        aria-label="Breadcrumb"
      >
        <span className="text-[#94a3b8]">{section}</span>
        <span className="text-[#94a3b8]"> / </span>
        <span className="font-medium text-[#f1f5f9]">{page}</span>
      </nav>

      <div className="flex shrink-0 items-center gap-3">
        <input
          type="search"
          placeholder="Search transactions..."
          className="h-9 w-[200px] shrink-0 rounded-lg border border-[#334155] bg-[#1e293b] px-3 text-sm text-[#94a3b8] placeholder:text-[#64748b] outline-none focus:border-[#475569] focus:ring-1 focus:ring-[#475569]"
          aria-label="Search transactions"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-9 min-w-30 cursor-pointer rounded-lg border border-[#334155] bg-[#1e293b] px-3 text-sm text-[#94a3b8] outline-none focus:border-[#475569] focus:ring-1 focus:ring-[#475569]"
          aria-label="Role"
        >
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#334155] bg-[#1e293b] text-[#94a3b8] transition-colors hover:bg-[#334155]/40 hover:text-[#f1f5f9]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
