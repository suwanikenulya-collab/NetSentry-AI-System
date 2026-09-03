import {
  AlertTriangle,
  CheckCircle2,
  Database,
  FileText,
} from "lucide-react";

import type {
  DatasetServerValidationResult,
} from "../types/dataset.types";


interface DatasetValidationResultCardProps {
  result: DatasetServerValidationResult;
}


export function DatasetValidationResultCard({
  result,
}: DatasetValidationResultCardProps) {
  const statusStyles = result.isValid
    ? {
        container: "border-emerald-200 bg-emerald-50",
        icon: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
      }
    : {
        container: "border-red-200 bg-red-50",
        icon: "text-red-600",
        badge: "bg-red-100 text-red-700",
      };

  return (
    <section
      className={`rounded-2xl border p-6 ${statusStyles.container}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {result.isValid ? (
            <CheckCircle2
              className={`mt-0.5 h-6 w-6 ${statusStyles.icon}`}
            />
          ) : (
            <AlertTriangle
              className={`mt-0.5 h-6 w-6 ${statusStyles.icon}`}
            />
          )}

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {result.isValid
                ? "Dataset ready for analysis"
                : "Dataset validation failed"}
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {result.message}
            </p>
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles.badge}`}
        >
          {result.isValid ? "VALID" : "INVALID"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText className="h-4 w-4" />
            File
          </div>

          <p
            className="mt-2 truncate font-medium text-slate-900"
            title={result.filename}
          >
            {result.filename}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Database className="h-4 w-4" />
            Data rows
          </div>

          <p className="mt-2 font-medium text-slate-900">
            {result.rowCount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Detected columns
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {result.detectedColumns.map((column) => (
            <span
              key={column}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
            >
              {column}
            </span>
          ))}
        </div>
      </div>

      {result.missingColumns.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-red-700">
            Missing required columns
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {result.missingColumns.map((column) => (
              <span
                key={column}
                className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700"
              >
                {column}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}