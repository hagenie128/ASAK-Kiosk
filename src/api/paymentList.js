import { API_ENDPOINTS } from "@/constants/api";
import { apiClient , unwrapResponse } from "./client";

//결제 수단 리스트

export const getPaymenMethods = () =>
    apiClient.get(API_ENDPOINTS.paymentMethods).then(unwrapResponse);
