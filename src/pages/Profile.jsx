import { Mail, User } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const { role } = useApp();
  const roleLabel = role === "admin" ? "Admin" : "Viewer";

  return (
    <div className="min-h-full w-full max-w-full bg-[#0f172a] px-4 py-5 sm:p-6">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg font-semibold text-[#f1f5f9] sm:text-xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">Your account information</p>
      </div>

      <div className="mx-auto w-full max-w-full rounded-xl border border-[#334155] bg-[#1e293b] p-5 sm:max-w-lg sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-[#10b981]/20 text-2xl font-semibold text-[#10b981]"
            aria-hidden
          >
            VK
          </div>
          <h2 className="mt-5 text-lg font-semibold text-[#f1f5f9]">
            Vansh Kumar
          </h2>
        </div>

        <dl className="mt-8 space-y-4 border-t border-[#334155] pt-8">
          <div className="flex gap-3 rounded-lg border border-[#334155] bg-[#0f172a]/50 px-4 py-3">
            <Mail
              className="mt-0.5 h-5 w-5 shrink-0 text-[#64748b]"
              strokeWidth={2}
              aria-hidden
            />
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
                Email
              </dt>
              <dd className="mt-1 break-all text-sm text-[#94a3b8]">
                vanshkumar5887.work@gmail.com
              </dd>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-[#334155] bg-[#0f172a]/50 px-4 py-3">
            <User
              className="mt-0.5 h-5 w-5 shrink-0 text-[#64748b]"
              strokeWidth={2}
              aria-hidden
            />
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
                Role
              </dt>
              <dd className="mt-1 text-sm font-medium text-[#10b981]">
                {roleLabel}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}
