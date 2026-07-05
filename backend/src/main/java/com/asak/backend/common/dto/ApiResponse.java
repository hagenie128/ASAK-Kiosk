package com.asak.backend.common.dto;

/**
 * Notion 06 API 명세 공통 응답 envelope.
 * 필드: success, status, code, message, data
 */
public record ApiResponse<T>(
        boolean success,
        int status,
        String code,
        String message,
        T data
) {

    public static <T> ApiResponse<T> ok(int status, String code, String message, T data) {
        return new ApiResponse<>(true, status, code, message, data);
    }

    public static <T> ApiResponse<T> ok(String code, String message, T data) {
        return ok(200, code, message, data);
    }

    public static <T> ApiResponse<T> fail(int status, String code, String message) {
        return new ApiResponse<>(false, status, code, message, null);
    }
}
