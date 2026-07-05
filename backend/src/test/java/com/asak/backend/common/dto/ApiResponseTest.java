package com.asak.backend.common.dto;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Notion 06 envelope 예시(API-001 성공/실패)와 필드명·형태 일치 검증.
 */
class ApiResponseTest {

    @Test
    void ok_matchesApi001SuccessEnvelope() {
        ApiResponse<List<?>> response = ApiResponse.ok(
                200,
                "CATEGORY_LIST_SUCCESS",
                "카테고리 목록 조회 성공",
                List.of()
        );

        assertTrue(response.success());
        assertEquals(200, response.status());
        assertEquals("CATEGORY_LIST_SUCCESS", response.code());
        assertEquals("카테고리 목록 조회 성공", response.message());
        assertEquals(List.of(), response.data());
    }

    @Test
    void fail_matchesApi001ErrorEnvelope() {
        ApiResponse<Void> response = ApiResponse.fail(
                500,
                "CATEGORY_LIST_FAILED",
                "카테고리 목록 조회 실패"
        );

        assertFalse(response.success());
        assertEquals(500, response.status());
        assertEquals("CATEGORY_LIST_FAILED", response.code());
        assertEquals("카테고리 목록 조회 실패", response.message());
        assertNull(response.data());
    }
}
