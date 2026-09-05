import {
  CircleCheckBig,
  ClipboardList,
  Clock3,
  FolderSearch,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const INVESTIGATION_FILTERS = [
  "All cases",
  "Open",
  "In progress",
  "Closed",
] as const;

const SUMMARY_CARDS = [
  {
    label: "Total cases",
    value: "—",
    description: "No investigations created",
    icon: ClipboardList,
    iconStyle: "bg-primary/10 text-primary",
  },
  {
    label: "Open",
    value: "—",
    description: "No open cases",
    icon: ShieldAlert,
    iconStyle: "bg-critical/10 text-critical",
  },
  {
    label: "In progress",
    value: "—",
    description: "No active investigations",
    icon: Clock3,
    iconStyle: "bg-primary/10 text-primary",
  },
  {
    label: "Closed",
    value: "—",
    description: "No completed cases",
    icon: CircleCheckBig,
    iconStyle: "bg-low/10 text-low",
  },
];

const TABLE_COLUMNS = [
  "Case ID",
  "Title",
  "Related alert",
  "Assigned analyst",
  "Priority",
  "Status",
  "Last updated",
];

export function InvestigationsPage() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof INVESTIGATION_FILTERS)[number]>(
      "All cases",
    );

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">
          Incident response
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Investigations
        </h1>

        <p className="mt-2 max-w-3xl text-muted">
          Organize suspicious activity into investigation cases,
          record findings and track each case until resolution.
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
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
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
                Investigation cases
              </h2>

              <p className="mt-1 text-sm text-muted">
                Review case ownership, priority, status and recent
                activity.
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
                placeholder="Search cases"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {INVESTIGATION_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
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

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-background">
              <tr>
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-subtle"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        <div className="flex min-h-96 flex-col items-center justify-center border-t border-border p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FolderSearch
              className="h-8 w-8"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-foreground">
            No investigation cases
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
            Investigations will appear here when an analyst creates a
            case from a genuine security alert.
          </p>

          {searchQuery && (
            <p className="mt-3 text-xs text-subtle">
              Current search: “{searchQuery}”
            </p>
          )}

          <Link
            to="/alerts"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            View Security Alerts
          </Link>
        </div>
      </section>
    </main>
  );
}