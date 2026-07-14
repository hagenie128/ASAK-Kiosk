import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

export const getMenus = (categoryId) =>
  apiClient.get(API_ENDPOINTS.menus, { params: { categoryId } }).then(unwrapResponse);

export const getMenu = (menuId) => apiClient.get(API_ENDPOINTS.menu(menuId)).then(unwrapResponse);
export const getMenuOptions = (menuId) => apiClient.get(API_ENDPOINTS.menuOptions(menuId)).then(unwrapResponse);
