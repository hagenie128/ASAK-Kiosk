import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

export const createOrder = (payload) => apiClient.post(API_ENDPOINTS.orders, payload).then(unwrapResponse);
