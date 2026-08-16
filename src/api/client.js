import axios from "axios";


export const apiClient = axios.create({
  // client.js
  /*
  [ vite proxy 사용 -> 아이패드 및 유연한 네트워크 연결 테스트 ]
   baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  */
  baseURL: "",
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
