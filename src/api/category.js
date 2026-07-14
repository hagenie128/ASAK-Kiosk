import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

export const getCategories = () => apiClient.get(API_ENDPOINTS.categories).then(unwrapResponse);
