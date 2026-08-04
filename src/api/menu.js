import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

// 메뉴 리스트(해당하는 카테고리 id)
export const getMenus = (categoryId) =>
  apiClient.get(API_ENDPOINTS.menus, { params: { categoryId } }).then(unwrapResponse);

// 메뉴 디테일 (옵션 포함)
export const getMenu = (menuId) => apiClient.get(API_ENDPOINTS.menu(menuId)).then(unwrapResponse);

