import { apiClient, USE_MOCK, loadMockData } from "./client";

// API-001 GET /api/categories
export async function getCategories() {
  if (USE_MOCK) {
    const mock = await loadMockData();
    return mock.categories.data;
  }
  const res = await apiClient.get("/api/categories");
  return res.data.data;
}

// API-002 GET /api/menus?categoryId=
export async function getMenus(categoryId) {
  if (USE_MOCK) {
    const mock = await loadMockData();
    return mock.menusByCategory[String(categoryId)]?.data ?? [];
  }
  const res = await apiClient.get("/api/menus", { params: { categoryId } });
  return res.data.data;
}

// API-003 GET /api/menus/{menuId}
export async function getMenuDetail(menuId) {
  if (USE_MOCK) {
    const mock = await loadMockData();
    return mock.menuDetail[String(menuId)]?.data ?? null;
  }
  const res = await apiClient.get(`/api/menus/${menuId}`);
  return res.data.data;
}

// API-004 GET /api/menus/{menuId}/options
export async function getMenuOptions(menuId) {
  if (USE_MOCK) {
    const mock = await loadMockData();
    return mock.menuOptions[String(menuId)]?.data ?? [];
  }
  const res = await apiClient.get(`/api/menus/${menuId}/options`);
  return res.data.data;
}
