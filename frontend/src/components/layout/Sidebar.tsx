import {
  BellRing,
  ChartNoAxesCombined,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  ScrollText,
  ShieldCheck,
  Upload,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "../ui/Button";
import { useAuth } from "../../features/auth/context/AuthContext";
import { cn } from "../../lib/cn";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const ANALYST_NAVIGATION: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Upload Dataset",
    path: "/datasets/upload",
    icon: Upload,
  },
  {
    label: "Traffic Analysis",
    path: "/traffic",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Security Alerts",
    path: "/alerts",
    icon: BellRing,
  },
  {
    label: "Investigations",
    path: "/investigations",
    icon: ClipboardList,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: FileText,
  },
];

const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    label: "User Management",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Audit Logs",
    path: "/admin/audit-logs",
    icon: ScrollText,
  },
];

export function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const navigationItems =
    user?.role === "admin"
      ? [...ANALYST_NAVIGATION, ...ADMIN_NAVIGATION]
      : ANALYST_NAVIGATION;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
          "border-r border-border bg-surface",
          "transition-transform duration-200",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ShieldCheck
                aria-hidden="true"
                className="h-5 w-5 text-primary-foreground"
              />
            </div>

            <div>
              <p className="font-semibold text-foreground">
                NetSentry AI
              </p>

              <p className="font-mono text-[9px] uppercase tracking-wider text-subtle">
                Security Operations
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-md p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1 overflow-y-auto p-3"
        >
          {navigationItems.map(
            ({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5",
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:bg-surface-hover hover:text-foreground",
                  )
                }
              >
                <Icon
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                />

                <span>{label}</span>
              </NavLink>
            ),
          )}
        </nav>

        <div className="border-t border-border p-3">
          {user && (
            <div className="mb-3 flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {user.initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.name}
                </p>

                <p className="truncate text-xs capitalize text-subtle">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LogOut className="h-4 w-4" />}
            onClick={logout}
            className="w-full justify-start"
          >
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}