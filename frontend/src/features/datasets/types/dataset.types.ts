export type DatasetValidationStatus =
  | "idle"
  | "selected"
  | "validating"
  | "valid"
  | "invalid";

export interface DatasetValidationResult {
  isValid: boolean;
  detectedColumns: string[];
  missingColumns: string[];
}

export interface DatasetValidationApiResponse {
  filename: string;
  is_valid: boolean;
  row_count: number;
  detected_columns: string[];
  missing_columns: string[];
  message: string;
}

export interface DatasetServerValidationResult
  extends DatasetValidationResult {
  filename: string;
  rowCount: number;
  message: string;
}