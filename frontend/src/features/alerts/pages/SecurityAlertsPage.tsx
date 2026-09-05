 import {
  BellRing,
  CircleCheckBig,
  Clock3,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const ALERT_FILTERS = [
  "All alerts",
  "Open",
  "Investigating",
  "Resolved",
] as const;

const SUMMARY_CARDS = [
  {
    label: "Total alerts",
    value: "—",
    description: "No analysis completed",
    icon: BellRing,
    iconStyle: "bg-primary/10 text-primary",
  },
  {
    label: "Critical alerts",
    value: "—",
    description: "Awaiting detection",
    icon: ShieldAlert,
    iconStyle: "bg-critical/10 text-critical",
  },
  {
    label: "Investigating",
    value: "—",
    description: "No active investigations",
    icon: Clock3,
    iconStyle: "bg-medium/10 text-medium",
  },
  {
    label: "Resolved",
    value: "—",
    description: "No resolved alerts",
    icon: CircleCheckBig,
    iconStyle: "bg-low/10 text-low",
  },
];

export function SecurityAlertsPage() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof ALERT_FILTERS)[number]>("All alerts");

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">
          Threat monitoring
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Security Alerts
        </h1>

        <p className="mt-2 max-w-3xl text-muted">
          Review suspicious network activity detected during traffic
          analysis and track how each alert is handled.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_CARDS.map(
          ({
            label,
            value,
            description,
            icon: Icon,
            iconStyle,
          }) => (
            <article
              key={label}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">{label}</p>

                  <p className="mt-3 text-3xl font-bold text-foreground">
                    {value}
                  </p>

                  <p className="mt-2 text-xs text-subtle">
                    {description}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
                >
                  <Icon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </article>
          ),
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="border-b border-border p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Alert queue
              </h2>

              <p className="mt-1 text-sm text-muted">
                Filter and review alerts produced by the detection
                service.
              </p>
            </div>

            <div className="relative w-full xl:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
                aria-hidden="true"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search by IP or alert type"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {ALERT_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-muted hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BellRing
              className="h-8 w-8"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-foreground">
            No security alerts available
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
            NetSentry has not generated any alerts because no dataset
            has been processed by the anomaly-detection model yet.
          </p>

          {searchQuery && (
            <p className="mt-3 text-xs text-subtle">
              Current search: “{searchQuery}”
            </p>
          )}

          <Link
            to="/traffic"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Go to Traffic Analysis
          </Link>
        </div>
      </section>
    </main>
  );
}