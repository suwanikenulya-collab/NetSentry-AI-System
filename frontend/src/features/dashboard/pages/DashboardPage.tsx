import {
  BellRing,
  ClipboardList,
  Database,
  ShieldCheck,
} from "lucide-react";
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
    color: "text-primary",
    background: "bg-primary/10",
  },
  {
    label: "Security alerts",
    value: "0",
    icon: BellRing,
    color: "text-high",
    background: "bg-high/10",
  },
  {
    label: "Open investigations",
    value: "0",
    icon: ClipboardList,
    color: "text-medium",
    background: "bg-medium/10",
  },
];

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <section>
        <p className="text-sm font-medium text-primary">
          Security overview
        </p>

        <h2 className="mt-1 text-3xl font-bold text-foreground">
          Welcome back, {user.name}
        </h2>

        <p className="mt-2 max-w-2xl text-muted">
          Monitor uploaded datasets, suspicious network
          activity and active security investigations.
        </p>
      </section>

      <section
        aria-label="Security statistics"
        className="mt-8 grid gap-5 md:grid-cols-3"
      >
        {DASHBOARD_ITEMS.map(
          ({
            label,
            value,
            icon: Icon,
            color,
            background,
          }) => (
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

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${background}`}
                >
                  <Icon
                    aria-hidden="true"
                    className={`h-5 w-5 ${color}`}
                  />
                </div>
              </CardHeader>
            </Card>
          ),
        )}
      </section>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            Network analysis workspace
          </CardTitle>

          <CardDescription>
            Upload your first network-traffic dataset to
            begin anomaly analysis.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-dashed border-border-strong p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck
                aria-hidden="true"
                className="h-6 w-6 text-primary"
              />
            </div>

            <p className="mt-4 font-medium text-foreground">
              No analysis available
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              Dataset statistics, anomaly scores and generated
              alerts will appear here after your first analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}