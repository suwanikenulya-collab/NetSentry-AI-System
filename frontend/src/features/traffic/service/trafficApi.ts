import type {
  TrafficSummaryResponse,
} from "../types/traffic.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";


interface ApiErrorResponse {
  detail?: string;
}


export async function analyzeTrafficFile(
  file: File,
): Promise<TrafficSummaryResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/traffic/analyze`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    let errorMessage =
      "The traffic dataset could not be analyzed.";

    try {
      const errorData =
        (await response.json()) as ApiErrorResponse;

      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(errorMessage);
  }

  return (
    await response.json()
  ) as TrafficSummaryResponse;
}