# DevCopilot 화면설계 업로드 가이드

> **편집·전체 내용은 Notion에서 관리합니다.** (hub 읽기 순서 **5** — 학원 PC DevCopilot 제출)

🔗 **[Notion — 화면설계 DevCopilot/Wiki 업로드](https://app.notion.com/p/39451ef04f0b81bc83a1f291eeb1ce31)** · hub: [📐 디자인 & 화면](https://app.notion.com/p/39451ef04f0b8163b1f9ebb477917efc)

**역할:** Notion SCR → DevCopilot/Wiki 업로드 절차. 화면 목록 정본 → [04. 화면 설계 SCR DB](https://app.notion.com/p/1c751ef04f0b825ea3aa8145f563bbc8)

## Git 산출물 (학원 USB/클라우드)

| 파일 | 용도 |
|------|------|
| `docs/screens/screens.md` | Screens UI 수동 입력용 표 |
| `docs/screens/screens.json` | 구조화 체크리스트 |
| `docs/screens/screens-devcopilot-import-array.json` | localStorage import 배열 |
| `docs/screens/screens-wiki.md` | Wiki 업로드 본문 |
| `asak-data/scripts/upload_screens_wiki.py` | Wiki API 업로드 |

재생성: `python asak-data/scripts/export_screens.py`

## 방법 비교

| | Screens UI (localStorage) | Wiki API |
|---|---|---|
| 저장 | 브라우저 로컬만 | 서버, 팀 공유 |
| 학원 PC | 매 PC마다 import | 한 번 업로드면 URL 공유 |
| **추천** | Figma 미리보기 데모 | **공용 PC → 1순위** |

## Wiki 업로드 (권장)

```powershell
python asak-data/scripts/upload_screens_wiki.py
python asak-data/scripts/upload_screens_wiki.py --dry-run
```

## localStorage import (선택)

1. `screens-devcopilot-import-array.json` 열기
2. Chrome F12 → Application → Local Storage → `devcopilot.ai.kr`
3. 키 `ws_2_screens` → JSON 배열 붙여넣기 → `/workspace/2/screens` 새로고침

## 학원 체크리스트

### 5분 (Wiki만)

- [ ] DevCopilot 로그인 (workspace 2)
- [ ] Wiki 화면설계 문서 확인 (없으면 `upload_screens_wiki.py`)
- [ ] 팀 Wiki URL 공유

### 30분 (Week 5~6 MVP 데모)

- [ ] Wiki 업로드 확인
- [ ] `ws_2_screens` localStorage import (선택)
- [ ] SCR-001~011 필드 `screens.md` 대조
- [ ] Figma URL 있으면 figmaUrl 입력

**Week 5 MVP**: SCR-001~008 · **Week 6 admin**: SCR-009~011 · SCR-012 최소 안내 · SCR-013~019 후반 확장

## Git 도구

- `asak-data/scripts/export_screens.py` — Notion 스냅샷 → export 재생성
- `asak-data/scripts/upload_screens_wiki.py` — DevCopilot Wiki API 업로드
