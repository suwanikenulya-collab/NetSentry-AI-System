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