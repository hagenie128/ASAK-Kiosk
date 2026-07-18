import { useCallback, useEffect, useState } from "react";
import kioskMock from "../../public/mocks/kiosk.json";

/**
 * SCR-003 메뉴 목록용 훅.
 * Backend business API가 준비되기 전까지 mock을 비동기로 읽어
 * Loading / Empty / Error / Success 상태를 화면에서 구분한다.
 *
 * 목표 계약: GET /api/kiosk/menuList (query categoryCode)
 * 현재 코드 엔드포인트: GET /menus?categoryId=… (api/menu.js)
 */
export function useMenuCategories() {
  const [status, setStatus] = useState("loading");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      // mock 지연 — 실제 API 전환 시 getCategories()로 교체
      await new Promise((r) => setTimeout(r, 200));
      const data = kioskMock.categories?.data ?? [];
      if (!Array.isArray(data) || data.length === 0) {
        setCategories([]);
        setStatus("empty");
        return;
      }
      setCategories(data);
      setStatus("success");
    } catch (err) {
      setCategories([]);
      setError(err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { status, categories, error, reload: load };
}

export function useMenuList(categoryId) {
  const [status, setStatus] = useState("loading");
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!categoryId) {
      setMenus([]);
      setStatus("empty");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 200));
      const data =
        kioskMock.menusByCategory?.[String(categoryId)]?.data ?? [];
      if (!Array.isArray(data) || data.length === 0) {
        setMenus([]);
        setStatus("empty");
        return;
      }
      setMenus(data);
      setStatus("success");
    } catch (err) {
      setMenus([]);
      setError(err);
      setStatus("error");
    }
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  return { status, menus, error, reload: load };
}
