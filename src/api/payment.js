import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

export const approvePayment = (payload) => apiClient.post(API_ENDPOINTS.payments, payload).then(unwrapResponse);
