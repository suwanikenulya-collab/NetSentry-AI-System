import type {
  DatasetValidationResult,
} from "../types/dataset.types";

export const MAX_DATASET_SIZE_BYTES =
  50 * 1024 * 1024;

export const REQUIRED_TRAFFIC_COLUMNS = [
  "timestamp",
  "src_ip",
  "dst_ip",
  "src_port",
  "dst_port",
  "protocol",
  "duration",
  "pkt_count",
  "bytes",
] as const;

const HEADER_PREVIEW_SIZE = 64 * 1024;

export class DatasetValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatasetValidationError";
  }
}

export async function validateDatasetFile(
  file: File,
): Promise<DatasetValidationResult> {
  validateFileProperties(file);

  const filePreview = await file
    .slice(0, HEADER_PREVIEW_SIZE)
    .text();

  const firstLine = filePreview
    .split(/\r?\n/)
    .find((line) => line.trim().length > 0);

  if (!firstLine) {
    throw new DatasetValidationError(
      "The selected CSV file does not contain a header row.",
    );
  }

  const detectedColumns = parseCsvHeader(firstLine);

  if (detectedColumns.length === 0) {
    throw new DatasetValidationError(
      "No columns were detected in the CSV header.",
    );
  }

  const missingColumns =
    REQUIRED_TRAFFIC_COLUMNS.filter(
      (requiredColumn) =>
        !detectedColumns.includes(requiredColumn),
    );

  return {
    isValid: missingColumns.length === 0,
    detectedColumns,
    missingColumns: [...missingColumns],
  };
}

function validateFileProperties(file: File) {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    throw new DatasetValidationError(
      "Only CSV files are supported.",
    );
  }

  if (file.size === 0) {
    throw new DatasetValidationError(
      "The selected file is empty.",
    );
  }

  if (file.size > MAX_DATASET_SIZE_BYTES) {
    throw new DatasetValidationError(
      "The selected file exceeds the 50 MB limit.",
    );
  }
}

function parseCsvHeader(headerLine: string) {
  const columns: string[] = [];
  let currentColumn = "";
  let insideQuotes = false;

  const normalizedLine = headerLine.replace(
    /^\uFEFF/,
    "",
  );

  for (
    let index = 0;
    index < normalizedLine.length;
    index += 1
  ) {
    const character = normalizedLine[index];
    const nextCharacter = normalizedLine[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        currentColumn += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (character === "," && !insideQuotes) {
      columns.push(normalizeColumn(currentColumn));
      currentColumn = "";
      continue;
    }

    currentColumn += character;
  }

  columns.push(normalizeColumn(currentColumn));

  return columns.filter(
    (column) => column.length > 0,
  );
}

function normalizeColumn(column: string) {
  return column.trim().toLowerCase();
}