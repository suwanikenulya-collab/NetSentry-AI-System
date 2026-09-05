import {
  Activity,
  ChartNoAxesCombined,
  Database,
  Search,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Link } from "react-router";

const SUMMARY_CARDS = [
  {
    label: "Total records",
    value: "—",
    description: "No dataset analyzed",
    icon: Database,
    iconStyle: "bg-primary/10 text-primary",
  },
  {
    label: "Normal traffic",
    value: "—",
    description: "Awaiting analysis",
    icon: ShieldCheck,
    iconStyle: "bg-low/10 text-low",
  },
  {
    label: "Anomalous traffic",
    value: "—",
    description: "Awaiting analysis",
    icon: ShieldAlert,
    iconStyle: "bg-critical/10 text-critical",
  },
  {
    label: "Anomaly rate",
    value: "—",
    description: "Awaiting analysis",
    icon: Activity,
    iconStyle: "bg-medium/10 text-medium",
  },
];

const TABLE_COLUMNS = [
  "Timestamp",
  "Source IP",
  "Destination IP",
  "Protocol",
  "Packets",
  "Bytes",
  "Anomaly score",
  "Status",
];

export function TrafficAnalysisPage() {
  return (
    <main className="space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">
          Network monitoring
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Traffic Analysis
        </h1>

        <p className="mt-2 max-w-3xl text-muted">
          Review network-flow records and inspect anomaly-detection
          results after a dataset has been processed.
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

      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ChartNoAxesCombined
                className="h-6 w-6"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                No analysis results yet
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                Upload and validate a network-traffic dataset first.
                Traffic statistics and anomaly results will appear
                here after the analysis service is implemented.
              </p>
            </div>
          </div>

          <Link
            to="/datasets/upload"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload dataset
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-border bg-surface p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Traffic classification
            </h2>

            <p className="mt-1 text-sm text-muted">
              Normal and anomalous network-flow distribution.
            </p>
          </div>

          <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-background p-8 text-center">
            <ChartNoAxesCombined
              className="h-10 w-10 text-subtle"
              aria-hidden="true"
            />

            <p className="mt-4 font-medium text-foreground">
              Classification chart unavailable
            </p>

            <p className="mt-2 max-w-sm text-sm text-muted">
              This chart will be generated using real results from
              the anomaly-detection model.
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Protocol distribution
            </h2>

            <p className="mt-1 text-sm text-muted">
              Distribution of traffic across network protocols.
            </p>
          </div>

          <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-background p-8 text-center">
            <Activity
              className="h-10 w-10 text-subtle"
              aria-hidden="true"
            />

            <p className="mt-4 font-medium text-foreground">
              Protocol data unavailable
            </p>

            <p className="mt-2 max-w-sm text-sm text-muted">
              Protocol statistics will appear after a dataset has
              been analyzed.
            </p>
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Network traffic records
            </h2>

            <p className="mt-1 text-sm text-muted">
              Inspect individual network-flow records and their
              analysis status.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
              aria-hidden="true"
            />

            <input
              type="search"
              placeholder="Search traffic records"
              disabled
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-60"
            />
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

        <div className="flex min-h-52 flex-col items-center justify-center border-t border-border p-8 text-center">
          <Database
            className="h-10 w-10 text-subtle"
            aria-hidden="true"
          />

          <p className="mt-4 font-medium text-foreground">
            No traffic records
          </p>

          <p className="mt-2 max-w-md text-sm text-muted">
            Records will appear here after the backend processes a
            validated dataset.
          </p>
        </div>
      </section>
    </main>
  );
}