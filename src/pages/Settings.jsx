import { Moon, RefreshCw, Shield } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Settings() {
  const { role, setRole, resetTransactions } = useApp();

  return (
    <div className="min-h-full w-full max-w-full bg-[#0f172a] px-4 py-5 sm:p-6">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg font-semibold text-[#f1f5f9] sm:text-xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Preferences and data controls
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-full flex-col gap-5 sm:max-w-lg sm:gap-6">
        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10b981]/15 text-[#10b981]">
              <Shield className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#f1f5f9]">Role</h2>
              <p className="text-xs text-[#64748b]">
                Switch role for this demo session
              </p>
            </div>
          </div>
          <label htmlFor="settings-role" className="sr-only">
            Role
          </label>
          <select
            id="settings-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-12 w-full rounded-lg border border-[#334155] bg-[#0f172a] px-4 text-base text-[#94a3b8] outline-none focus:border-[#10b981]/50 focus:ring-1 focus:ring-[#10b981]/40"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#334155] text-[#94a3b8]">
              <Moon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#f1f5f9]">Theme</h2>
              <p className="mt-1 text-sm text-[#94a3b8]">
                Dark Theme — Active
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-6">
          <h2 className="text-sm font-semibold text-[#f1f5f9]">Data</h2>
          <p className="mt-1 text-xs text-[#64748b]">
            Restore transactions to the original mock dataset.
          </p>
          <button
            type="button"
            onClick={() => resetTransactions()}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#334155] bg-[#0f172a] px-4 text-sm font-medium text-[#94a3b8] transition-colors hover:border-[#10b981]/40 hover:bg-[#10b981]/10 hover:text-[#10b981]"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
            Reset Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
