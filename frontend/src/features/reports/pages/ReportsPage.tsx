import {
  Activity,
  CalendarDays,
  Clock3,
  FileText,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

const REPORT_TYPES = [
  {
    value: "traffic-summary",
    title: "Traffic Summary",
    description:
      "Network records, protocol usage and traffic-volume statistics.",
    icon: Activity,
  },
  {
    value: "security-alerts",
    title: "Security Alert Report",
    description:
      "Detected alerts grouped by severity, status and source.",
    icon: ShieldAlert,
  },
  {
    value: "investigation-summary",
    title: "Investigation Summary",
    description:
      "Investigation cases, findings, ownership and resolution status.",
    icon: FileText,
  },
] as const;

const TABLE_COLUMNS = [
  "Report name",
  "Report type",
  "Created by",
  "Created date",
  "Status",
  "Action",
];

export function ReportsPage() {
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">
          Security documentation
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Reports
        </h1>

        <p className="mt-2 max-w-3xl text-muted">
          Prepare structured reports from network analysis, security
          alerts and investigation findings.
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_1.9fr]">
        <article className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Generate report
              </h2>

              <p className="mt-1 text-sm text-muted">
                Select the information and date range required for
                the report.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="report-type"
                className="text-sm font-medium text-foreground"
              >
                Report type
              </label>

              <select
                id="report-type"
                value={reportType}
                onChange={(event) =>
                  setReportType(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
              >
                <option value="">Select report type</option>
                <option value="traffic-summary">
                  Traffic Summary
                </option>
                <option value="security-alerts">
                  Security Alert Report
                </option>
                <option value="investigation-summary">
                  Investigation Summary
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="start-date"
                className="text-sm font-medium text-foreground"
              >
                Start date
              </label>

              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="end-date"
                className="text-sm font-medium text-foreground"
              >
                End date
              </label>

              <input
                id="end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) =>
                  setEndDate(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>

            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground opacity-50"
            >
              Generate report
            </button>

            <p className="text-xs leading-5 text-subtle">
              Report generation will be enabled after real analysis
              data and report APIs are implemented.
            </p>
          </div>
        </article>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {REPORT_TYPES.map(
            ({ value, title, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setReportType(value)}
                className={`rounded-2xl border p-5 text-left transition ${
                  reportType === value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface hover:border-border-strong"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      reportType === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-foreground">
                      {title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-muted">
                      {description}
                    </p>
                  </div>
                </div>
              </button>
            ),
          )}
        </section>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Report history
            </h2>

            <p className="mt-1 text-sm text-muted">
              Previously generated reports will appear here.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
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
              placeholder="Search reports"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
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

        <div className="flex min-h-72 flex-col items-center justify-center border-t border-border p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Clock3
              className="h-8 w-8"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-foreground">
            No reports generated
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
            Generated reports will be listed here when traffic,
            alert and investigation information becomes available.
          </p>

          {searchQuery && (
            <p className="mt-3 text-xs text-subtle">
              Current search: “{searchQuery}”
            </p>
          )}

          {(startDate || endDate) && (
            <div className="mt-4 flex items-center gap-2 text-xs text-subtle">
              <CalendarDays
                className="h-4 w-4"
                aria-hidden="true"
              />
              <span>
                Selected range: {startDate || "Not selected"} to{" "}
                {endDate || "Not selected"}
              </span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}