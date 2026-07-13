import axios from "axios";

// 백엔드 준비되면 .env에 VITE_API_BASE_URL만 채우면 됨 (예: http://localhost:8080)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 5000,
});

// 백엔드가 아직 없을 때 mock JSON으로 개발하기 위한 스위치.
// .env에 VITE_USE_MOCK=false 로 바꾸면 실제 API를 호출한다.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

let mockDataPromise = null;
export function loadMockData() {
  if (!mockDataPromise) {
    mockDataPromise = fetch("/mocks/kiosk.json").then((res) => res.json());
  }
  return mockDataPromise;
}
