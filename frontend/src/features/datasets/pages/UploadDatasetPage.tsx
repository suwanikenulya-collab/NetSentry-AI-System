import {
  CheckCircle2,
  CircleAlert,
  FileSpreadsheet,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import { Button } from "../../../components/ui/Button";
import { validateDatasetFile } from "../services/datasetValidation";
import type {
  DatasetValidationResult,
  DatasetValidationStatus,
} from "../types/dataset.types";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export function UploadDatasetPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] =
    useState<DatasetValidationStatus>("idle");
  const [validationResult, setValidationResult] =
    useState<DatasetValidationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(file: File) {
    setSelectedFile(file);
    setStatus("selected");
    setValidationResult(null);
    setErrorMessage("");
  }

  function handleFileInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (file) {
      selectFile(file);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      selectFile(file);
    }
  }

  async function handleValidation() {
    if (!selectedFile) {
      setErrorMessage("Please select a CSV file first.");
      return;
    }

    setStatus("validating");
    setErrorMessage("");
    setValidationResult(null);

    try {
      const result = await validateDatasetFile(selectedFile);

      setValidationResult(result);
      setStatus(result.isValid ? "valid" : "invalid");

      if (!result.isValid) {
        setErrorMessage(
          "The dataset is missing one or more required columns.",
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The dataset could not be validated.";

      setStatus("invalid");
      setErrorMessage(message);
    }
  }

  function clearFile() {
    setSelectedFile(null);
    setStatus("idle");
    setValidationResult(null);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <main className="space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">
          Dataset management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Upload Network Traffic Dataset
        </h1>

        <p className="mt-2 max-w-3xl text-muted">
          Upload a CSV containing network-flow records. NetSentry will
          validate its structure before sending it to the analysis
          service.
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-foreground">
            Select dataset
          </h2>

          <p className="mt-1 text-sm text-muted">
            Drag and drop a file or select one from your computer.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div
            className={`mt-6 rounded-xl border-2 border-dashed p-10 text-center transition ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border-strong bg-background"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadCloud
              className="mx-auto h-12 w-12 text-primary"
              aria-hidden="true"
            />

            <p className="mt-4 font-semibold text-foreground">
              Drop your network traffic CSV here
            </p>

            <p className="mt-2 text-sm text-muted">
              Only CSV files up to 50 MB are accepted.
            </p>

            <Button
              type="button"
              className="mt-5"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse files
            </Button>
          </div>

          {selectedFile && (
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-border bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <FileSpreadsheet
                  className="h-8 w-8 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {selectedFile.name}
                  </p>

                  <p className="text-sm text-muted">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="self-start rounded-lg p-2 text-muted transition hover:bg-surface-hover hover:text-foreground sm:self-auto"
                onClick={clearFile}
                aria-label="Remove selected file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mt-5 flex gap-3 rounded-xl border border-critical/40 bg-critical/10 p-4">
              <CircleAlert
                className="h-5 w-5 shrink-0 text-critical"
                aria-hidden="true"
              />

              <p className="text-sm text-critical">
                {errorMessage}
              </p>
            </div>
          )}

          {status === "valid" && (
            <div className="mt-5 flex gap-3 rounded-xl border border-low/40 bg-low/10 p-4">
              <CheckCircle2
                className="h-5 w-5 shrink-0 text-low"
                aria-hidden="true"
              />

              <div>
                <p className="font-medium text-foreground">
                  Dataset structure is valid
                </p>

                <p className="mt-1 text-sm text-muted">
                  The file is ready to be uploaded when we connect the
                  backend.
                </p>
              </div>
            </div>
          )}

          {validationResult &&
            validationResult.detectedColumns.length > 0 && (
              <div className="mt-5">
                <h3 className="font-medium text-foreground">
                  Detected columns
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {validationResult.detectedColumns.map((column) => (
                    <span
                      key={column}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted"
                    >
                      {column}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {validationResult &&
            validationResult.missingColumns.length > 0 && (
              <div className="mt-5">
                <h3 className="font-medium text-critical">
                  Missing columns
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {validationResult.missingColumns.map((column) => (
                    <span
                      key={column}
                      className="rounded-full border border-critical/40 bg-critical/10 px-3 py-1 text-xs text-critical"
                    >
                      {column}
                    </span>
                  ))}
                </div>
              </div>
            )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleValidation}
              disabled={
                !selectedFile || status === "validating"
              }
            >
              {status === "validating"
                ? "Validating..."
                : "Validate dataset"}
            </Button>

            {selectedFile && (
              <Button
                type="button"
                variant="outline"
                onClick={clearFile}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Dataset requirements
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>• CSV format only</li>
            <li>• Maximum file size: 50 MB</li>
            <li>• First row must contain column names</li>
            <li>• One network connection per row</li>
          </ul>

          <h3 className="mt-7 font-medium text-foreground">
            Required columns
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "timestamp",
              "src_ip",
              "dst_ip",
              "src_port",
              "dst_port",
              "protocol",
              "duration",
              "pkt_count",
              "bytes",
            ].map((column) => (
              <code
                key={column}
                className="rounded-md bg-background px-2 py-1 text-xs text-primary"
              >
                {column}
              </code>
            ))}
          </div>

          <p className="mt-6 text-xs leading-5 text-subtle">
            This frontend validation checks the basic CSV structure.
            The backend will later perform stricter security and data
            validation.
          </p>
        </aside>
      </section>
    </main>
  );
}