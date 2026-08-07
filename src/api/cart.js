import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

/**
 * 장바구니
 * 요청 정본: 
 * 
  {
    "items": [
      {
        "clientCartItemId": "a1b2c3d4-...",
        "menuId": 364,
        "quantity": 1,
        "optionItems": [
          {
            "optionItemId": 269,
            "quantity": 1
          }
        ],
        "excludedIngredientIds": []
      }
    ]
  }
 */
export const validateCart = (cartValidationRequest)=> apiClient.post(API_ENDPOINTS.carts, cartValidationRequest).then(unwrapResponse);

