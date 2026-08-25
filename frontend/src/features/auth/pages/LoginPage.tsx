import {
  BellRing,
  BrainCircuit,
  Database,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { LoginForm } from "../components/LoginForm";

const FEATURES = [
  {
    icon: Database,
    label: "Batch CSV dataset analysis",
  },
  {
    icon: BrainCircuit,
    label: "ML-assisted anomaly detection",
  },
  {
    icon: BellRing,
    label: "Prioritized security alerting",
  },
  {
    icon: FileText,
    label: "Structured incident reporting",
  },
];

export function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden border-r border-border bg-surface p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <Brand />

        <div className="max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary">
            Network Security Platform
          </p>

          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            ML-Assisted Network Security Analysis
          </h1>

          <p className="mt-5 max-w-lg leading-7 text-muted">
            Upload network-traffic datasets, detect anomalous
            activity, manage security alerts and generate
            actionable incident reports through one unified
            platform.
          </p>

          <div className="mt-9 grid gap-4">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
                  <Icon
                    aria-hidden="true"
                    className="h-4 w-4 text-primary"
                  />
                </div>

                <span className="text-sm text-gray-300">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-xs text-subtle">
          Demo build v0.1.0 · Authorized access only
        </p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>

          <div className="mb-8">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-primary lg:hidden">
              Security Operations Centre
            </p>

            <h2 className="text-3xl font-bold">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-muted">
              Access the NetSentry Security Operations Centre.
            </p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-xs leading-5 text-subtle">
            Accounts will be managed by the system
            administrator when the backend is connected.
          </p>
        </div>
      </section>
    </main>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
        <ShieldCheck
          aria-hidden="true"
          className="h-6 w-6 text-primary-foreground"
        />
      </div>

      <div>
        <p className="font-bold text-foreground">
          NetSentry AI
        </p>

        <p className="font-mono text-[10px] uppercase tracking-wider text-subtle">
          Security Operations Centre
        </p>
      </div>
    </div>
  );
}