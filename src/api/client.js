import axios from "axios";

import { API_BASE_PATH } from "../constants/api";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? API_BASE_PATH,
  headers: { Accept: "application/json" },
});

/** Unwrap the team's `{ success, status, code, message, data }` envelope. */
export function unwrapResponse(response) {
  const body = response.data;
  if (!body?.success) {
    const error = new Error(body?.message ?? "API request failed");
    error.code = body?.code;
    error.status = body?.status ?? response.status;
    throw error;
  }
  return body.data;
}
