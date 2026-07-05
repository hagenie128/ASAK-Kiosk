"""REQ ID linkage maps for DevCopilot workspace 2 quality upload."""
from __future__ import annotations

import re

REQ_ID_RE = re.compile(r"(?:FWD|LMIS|KSD|RTOS|DEV|PRESENT)-[A-Z]+-\d{3}")
API_REF_RE = re.compile(r"API-(\d{3})")
SCR_REF_RE = re.compile(r"SCR-(\d{3})")
SC_REF_RE = re.compile(r"SC-(\d{3})")
SC_TITLE_PREFIX_RE = re.compile(r"^SC-\d{3}\s*")

API_REQ_MAP: dict[str, str] = {
    "API-001": "FWD-MENU-001",
    "API-002": "FWD-MENU-001",
    "API-003": "FWD-MENU-002",
    "API-004": "FWD-MENU-003",
    "API-005": "FWD-ORDER-001",
    "API-006": "FWD-PAY-001",
    "API-007": "LMIS-ORDER-001",
    "API-008": "LMIS-ORDER-003",
    "API-009": "LMIS-MENU-001",
    "API-010": "LMIS-MENU-001",
    "API-011": "LMIS-MENU-004",
    "API-012": "LMIS-MENU-004",
    "API-013": "FWD-PAY-001",
    "API-014": "LMIS-PAY-001",
    "API-015": "LMIS-ORDER-005",
    "API-016": "FWD-CART-001",
    "API-017": "FWD-UI-001",
}

# Secondary REQ IDs appended to API description (Notion MCP + screens snapshot)
API_EXTRA_REQS: dict[str, list[str]] = {
    "API-005": ["DEV-ORDER-001"],
    "API-006": ["DEV-PAY-001"],
    "API-007": ["LMIS-ORDER-002"],
}

SCR_REQ_MAP: dict[str, list[str]] = {
    "SCR-001": ["FWD-UI-002", "FWD-UI-005"],
    "SCR-002": ["FWD-ORDER-001"],
    "SCR-003": ["FWD-MENU-001", "FWD-MENU-006", "FWD-UI-001", "FWD-UI-002", "LMIS-MENU-002"],
    "SCR-004": [
        "FWD-MENU-001", "FWD-MENU-002", "FWD-MENU-003", "FWD-MENU-004",
        "FWD-MENU-010", "FWD-MENU-014", "FWD-MENU-015", "LMIS-MENU-002",
    ],
    "SCR-005": ["FWD-CART-001", "FWD-CART-002"],
    "SCR-006": ["FWD-CART-001", "FWD-CART-002", "FWD-ORDER-001", "DEV-ORDER-001"],
    "SCR-007": ["FWD-PAY-001", "FWD-PAY-002", "LMIS-MEMBER-001", "KSD-PAY-001"],
    "SCR-008": ["FWD-PAY-002", "FWD-ORDER-002", "RTOS-DEVICE-001", "RTOS-DEVICE-002"],
    "SCR-009": ["LMIS-ORDER-001", "LMIS-ORDER-002", "LMIS-ORDER-004"],
    "SCR-010": ["LMIS-ORDER-001", "LMIS-ORDER-002", "LMIS-ORDER-003", "LMIS-ORDER-004", "LMIS-ORDER-006"],
    "SCR-011": ["LMIS-MENU-001", "LMIS-MENU-002"],
    "SCR-012": ["FWD-PAY-002", "DEV-PAY-002", "KSD-PAY-001"],
    "SCR-013": ["FWD-SYS-001"],
    "SCR-014": ["FWD-UI-001", "FWD-UI-003"],
    "SCR-015": ["LMIS-ORDER-005"],
    "SCR-016": ["LMIS-MENU-004"],
    "SCR-017": ["LMIS-MENU-004", "FWD-MENU-013", "FWD-MENU-014", "FWD-MENU-015", "LMIS-MENU-006"],
    "SCR-018": ["LMIS-PAY-001"],
    "SCR-019": ["LMIS-ORDER-005", "LMIS-MENU-005"],
}

# Notion MCP verified scenario -> REQ IDs (관련 요구사항 field)
SCENARIO_REQ_MAP: dict[str, list[str]] = {
    "SC-001": [
        "FWD-UI-001", "FWD-UI-002", "FWD-UI-005", "FWD-MENU-001", "FWD-MENU-002",
        "FWD-CART-001", "FWD-MENU-003", "FWD-PAY-001", "FWD-PAY-002",
    ],
    "SC-002": ["FWD-UI-001", "FWD-UI-002", "FWD-MENU-001", "FWD-CART-001", "FWD-PAY-001"],
    "SC-003": ["FWD-PAY-002", "KSD-PAY-001", "FWD-CART-001", "DEV-PAY-001"],
    "SC-004": [
        "FWD-MENU-001", "FWD-MENU-002", "FWD-MENU-003", "FWD-MENU-006",
        "FWD-MENU-010", "DEV-PAY-001",
    ],
    "SC-005": ["FWD-PAY-002", "KSD-PAY-001", "FWD-CART-001", "LMIS-MEMBER-001"],
    "SC-006": ["LMIS-MENU-004", "LMIS-MENU-006"],
    "SC-007": ["FWD-MENU-007", "FWD-MENU-003", "FWD-MENU-010", "FWD-MENU-009"],
    "SC-008": ["LMIS-MENU-001", "LMIS-MENU-002", "FWD-MENU-001"],
    "SC-009": ["FWD-CART-002"],
    "SC-010": ["LMIS-MENU-001", "LMIS-MENU-002", "FWD-MENU-001"],
    "SC-011": ["FWD-CART-001", "FWD-ORDER-001", "DEV-ORDER-001"],
    "SC-012": ["LMIS-ORDER-003", "LMIS-ORDER-001", "LMIS-ORDER-002"],
    "SC-013": ["FWD-SYS-001", "DEV-SYS-001"],
    "SC-014": ["FWD-ORDER-001", "FWD-ORDER-002"],
    "SC-015": ["RTOS-DEVICE-001", "RTOS-DEVICE-002", "FWD-PAY-001"],
    "SC-016": ["LMIS-ORDER-005", "LMIS-ORDER-006"],
    "SC-017": ["FWD-PAY-001", "FWD-PAY-002", "KSD-PAY-001", "LMIS-MEMBER-001"],
    "SC-018": ["FWD-UI-001", "FWD-UI-003"],
    "SC-019": ["LMIS-MENU-001", "LMIS-MENU-005"],
    "SC-020": ["LMIS-ORDER-001", "LMIS-ORDER-003", "LMIS-ORDER-002"],
    "SC-021": ["FWD-UI-001", "FWD-UI-003"],
    "SC-022": ["FWD-MENU-008", "FWD-MENU-009", "LMIS-ORDER-006"],
    "SC-023": ["FWD-SYS-001"],
    "SC-024": ["RTOS-DEVICE-003", "DEV-SYS-002", "FWD-CART-001", "FWD-PAY-001", "LMIS-ORDER-001"],
}

# WBS task_id -> REQ IDs (Notion 관련 산출물 + MCP overrides)
WBS_TASK_REQ_MAP: dict[str, list[str]] = {
    "WBS-001": ["LMIS-MENU-003", "KSD-ARCH-001"],
    "WBS-002": ["FWD-UI-001", "LMIS-ORDER-001"],
    "WBS-003": ["DEV-SYS-001"],
    "WBS-004": ["KSD-ARCH-001", "LMIS-ORDER-001"],
    "WBS-005": ["FWD-UI-001", "FWD-UI-002", "FWD-UI-003", "FWD-UI-005"],
    "WBS-006": ["DEV-SYS-001"],
    "WBS-007": ["FWD-MENU-001", "FWD-MENU-006", "LMIS-MENU-002"],
    "WBS-008": ["FWD-MENU-002", "FWD-MENU-003", "FWD-MENU-009", "FWD-MENU-010", "FWD-MENU-014"],
    "WBS-009": ["FWD-CART-001", "FWD-CART-002", "FWD-ORDER-001"],
    "WBS-010": ["FWD-PAY-001", "FWD-PAY-002", "DEV-PAY-001", "FWD-ORDER-002"],
    "WBS-011": ["FWD-MENU-001", "FWD-MENU-003", "FWD-MENU-006"],
    "WBS-012": ["FWD-ORDER-001", "LMIS-ORDER-001", "DEV-ORDER-001"],
    "WBS-013": ["LMIS-MENU-001", "LMIS-MENU-002"],
    "WBS-014": ["DEV-SYS-001"],
    "WBS-015": ["DEV-SYS-001", "FWD-MENU-001"],
    "WBS-016": ["FWD-PAY-002", "FWD-SYS-001", "DEV-SYS-001", "DEV-PAY-001"],
    "WBS-017": ["DEV-SYS-002"],
    "WBS-018": ["DEV-SYS-002", "FWD-UI-001"],
    "WBS-019": ["PRESENT-001", "DEV-SYS-002"],
    "WBS-020": ["DEV-SYS-002"],
    "WBS-021": ["FWD-SYS-001"],
    "WBS-022": ["FWD-UI-001", "FWD-UI-005"],
    "WBS-023": ["KSD-ARCH-001"],
    "WBS-024": ["FWD-MENU-001", "LMIS-MENU-003"],
    "WBS-025": ["FWD-CART-001"],
    "WBS-026": ["FWD-MENU-004", "FWD-MENU-015"],
    "WBS-027": ["DEV-PAY-002", "DEV-SYS-001", "FWD-PAY-002", "KSD-PAY-001"],
    "WBS-028": ["FWD-SYS-001"],
    "WBS-029": ["LMIS-MENU-004", "LMIS-MENU-005", "LMIS-MENU-006"],
    "WBS-030": ["LMIS-PAY-001"],
    "WBS-031": ["DEV-SYS-002"],
    "WBS-032": ["FWD-UI-001", "FWD-UI-003"],
    "WBS-034": ["RTOS-DEVICE-001", "RTOS-DEVICE-002", "RTOS-DEVICE-003"],
    "WBS-035": ["LMIS-ORDER-001", "LMIS-ORDER-002", "LMIS-ORDER-003"],
    "WBS-036": ["LMIS-ORDER-001", "LMIS-ORDER-002", "LMIS-ORDER-003", "LMIS-ORDER-006"],
    "WBS-EXT-001": ["FWD-CART-001"],
    "WBS-EXT-002": ["LMIS-PAY-001"],
}

TC_SCENARIO_MAP: dict[str, str] = {
    "TC-001": "SC-001",
    "TC-002": "SC-002",
    "TC-003": "SC-008",
    "TC-004": "SC-003",
    "TC-005": "SC-009",
    "TC-006": "SC-010",
    "TC-007": "SC-013",
    "TC-008": "SC-018",
    "TC-009": "SC-020",
    "TC-010": "SC-019",
    "TC-011": "SC-006",
    "TC-012": "SC-018",
    "TC-013": "SC-016",
    "TC-014": "SC-020",
}

TC_REQ_OVERRIDE: dict[str, list[str]] = {
    "TC-001": ["FWD-MENU-001", "FWD-PAY-001", "FWD-ORDER-001", "DEV-ORDER-001"],
    "TC-002": ["FWD-UI-001", "FWD-UI-002", "FWD-MENU-001", "FWD-ORDER-002"],
    "TC-003": ["LMIS-MENU-001", "LMIS-MENU-002", "FWD-MENU-001"],
    "TC-004": ["FWD-PAY-002", "KSD-PAY-001", "DEV-PAY-001"],
    "TC-005": ["FWD-CART-002", "LMIS-MEMBER-001"],
    "TC-006": ["LMIS-MENU-001", "LMIS-MENU-002"],
    "TC-007": ["FWD-SYS-001"],
    "TC-008": ["FWD-UI-001", "FWD-UI-003"],
    "TC-009": ["LMIS-ORDER-005"],
    "TC-010": ["LMIS-MENU-004"],
    "TC-011": ["LMIS-MENU-004", "LMIS-MENU-006", "FWD-MENU-014", "FWD-MENU-015"],
    "TC-012": ["LMIS-PAY-001"],
    "TC-013": ["LMIS-ORDER-005"],
    "TC-014": ["LMIS-ORDER-001", "LMIS-ORDER-002", "LMIS-ORDER-003", "LMIS-ORDER-006"],
}


def parse_req_list(text: str) -> list[str]:
    if not text:
        return []
    found = REQ_ID_RE.findall(str(text))
    if "," in str(text):
        for part in str(text).split(","):
            found.extend(REQ_ID_RE.findall(part))
    return sorted(set(found))


def expand_refs(text: str) -> list[str]:
    reqs: set[str] = set(parse_req_list(text))
    for api_num in API_REF_RE.findall(text or ""):
        req = API_REQ_MAP.get(f"API-{api_num}")
        if req:
            reqs.add(req)
    for scr_num in SCR_REF_RE.findall(text or ""):
        for req in SCR_REQ_MAP.get(f"SCR-{scr_num}", []):
            reqs.add(req)
    for sc_num in SC_REF_RE.findall(text or ""):
        for req in SCENARIO_REQ_MAP.get(f"SC-{sc_num}", []):
            reqs.add(req)
    return sorted(reqs)


def strip_scenario_id_prefix(title: str) -> str:
    """Remove leading SC-NNN prefix from scenario display title."""
    return SC_TITLE_PREFIX_RE.sub("", (title or "").strip()).strip()


def scenario_display_title(
    base_title: str,
    req_ids: list[str],
    *,
    primary: str | None = None,
) -> str:
    base = strip_scenario_id_prefix(base_title)
    return title_with_req(base, req_ids, primary_only=True, primary=primary)


def req_prefix(req_ids: list[str]) -> str:
    return "".join(f"[{rid}]" for rid in sorted(set(req_ids)))


def title_with_req(base_title: str, req_ids: list[str], *, primary_only: bool = False, primary: str | None = None) -> str:
    base = base_title.strip()
    if not req_ids:
        return base
    if primary_only:
        pick = primary or req_ids[0]
        suffix = f" ({pick})"
        if suffix in base:
            return base
        return f"{base}{suffix}"
    prefix = req_prefix(req_ids)
    if base.startswith(prefix):
        return base
    return f"{prefix} {base}"


def scenario_req_ids(scenario_id: str, props: dict | None = None) -> list[str]:
    mapped = SCENARIO_REQ_MAP.get(scenario_id, [])
    reqs: set[str] = set(mapped)
    if props:
        reqs.update(parse_req_list(str(props.get("관련 요구사항", ""))))
        reqs.update(expand_refs(str(props.get("관련 API", ""))))
        reqs.update(expand_refs(str(props.get("관련 화면", ""))))
    if mapped:
        ordered = [r for r in mapped if r in reqs]
        extras = sorted(reqs - set(ordered))
        return ordered + extras
    return sorted(reqs)


def task_req_ids(task_id: str, props: dict | None = None) -> list[str]:
    if task_id in WBS_TASK_REQ_MAP:
        return list(WBS_TASK_REQ_MAP[task_id])
    reqs: set[str] = set()
    if props:
        blob = " ".join(
            str(props.get(k, ""))
            for k in ("관련 산출물", "비고", "작업명", "단계", "구분")
        )
        reqs.update(parse_req_list(blob))
        reqs.update(expand_refs(blob))
    return sorted(reqs)


def api_req_ids(api_id: str) -> list[str]:
    req = API_REQ_MAP.get(api_id)
    return [req] if req else []


def api_all_req_ids(api_id: str) -> list[str]:
    """Primary + extra REQ IDs for API description/title enrichment."""
    reqs: list[str] = []
    primary = API_REQ_MAP.get(api_id)
    if primary:
        reqs.append(primary)
    for extra in API_EXTRA_REQS.get(api_id, []):
        if extra not in reqs:
            reqs.append(extra)
    return reqs


def api_description_text(base: str, api_id: str) -> str:
    """Append (REQ-ID) suffixes for audit substring matching."""
    text = (base or "").strip()
    for rid in api_all_req_ids(api_id):
        suffix = f" ({rid})"
        if suffix not in text:
            text = f"{text}{suffix}"
    return text


def qa_req_ids(tc_id: str, props: dict | None = None) -> list[str]:
    reqs: set[str] = set(TC_REQ_OVERRIDE.get(tc_id, []))
    if props:
        reqs.update(parse_req_list(str(props.get("비고", ""))))
        sc = TC_SCENARIO_MAP.get(tc_id, "")
        if sc:
            reqs.update(SCENARIO_REQ_MAP.get(sc, []))
    return sorted(reqs)
