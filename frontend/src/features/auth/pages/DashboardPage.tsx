import {
  BellRing,
  Database,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { useAuth } from "../../auth/context/AuthContext";

const DASHBOARD_ITEMS = [
  {
    label: "Uploaded datasets",
    value: "0",
    icon: Database,
  },
  {
    label: "Security alerts",
    value: "0",
    icon: BellRing,
  },
  {
    label: "Open investigations",
    value: "0",
    icon: ShieldCheck,
  },
];

export function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ShieldCheck
                aria-hidden="true"
                className="h-5 w-5 text-primary-foreground"
              />
            </div>

            <div>
              <p className="font-semibold">
                NetSentry AI
              </p>

              <p className="text-xs text-subtle">
                Security Operations Centre
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {user.name}
              </p>

              <p className="text-xs capitalize text-muted">
                {user.role}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                <LogOut className="h-4 w-4" />
              }
              onClick={logout}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div>
          <p className="text-sm text-primary">
            Security overview
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Welcome back, {user.name}
          </h1>

          <p className="mt-2 text-muted">
            Monitor uploaded datasets, suspicious network
            activity and security investigations.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {DASHBOARD_ITEMS.map(
            ({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardDescription className="mt-0">
                      {label}
                    </CardDescription>

                    <CardTitle className="mt-2 text-3xl">
                      {value}
                    </CardTitle>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5 text-primary"
                    />
                  </div>
                </CardHeader>
              </Card>
            ),
          )}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              Frontend foundation completed
            </CardTitle>

            <CardDescription>
              Real dataset and alert information will appear
              after the API is connected.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-dashed border-border-strong p-8 text-center">
              <Database
                aria-hidden="true"
                className="mx-auto h-9 w-9 text-subtle"
              />

              <p className="mt-3 font-medium">
                No datasets uploaded
              </p>

              <p className="mt-1 text-sm text-muted">
                The dataset-upload workflow will be our next
                major frontend feature.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}