import {
  Bell,
  Menu,
} from "lucide-react";
import { useLocation } from "react-router";
import { useAuth } from "../../features/auth/context/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/datasets/upload": "Upload Dataset",
  "/traffic": "Traffic Analysis",
  "/alerts": "Security Alerts",
  "/investigations": "Investigations",
  "/reports": "Reports",
  "/admin/users": "User Management",
  "/admin/audit-logs": "Audit Logs",
};

export function Header({
  onMenuClick,
}: HeaderProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const pageTitle =
    PAGE_TITLES[pathname] ?? "NetSentry AI";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-md p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {pageTitle}
          </h1>

          <p className="hidden text-xs text-subtle sm:block">
            Network security monitoring platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="View notifications"
          className="relative rounded-md p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full border-2 border-surface bg-critical" />
        </button>

        <div className="h-7 w-px bg-border" />

        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">
                {user.name}
              </p>

              <p className="text-xs capitalize text-subtle">
                {user.role}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user.initials}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}