#!/usr/bin/env python3
"""Validate API envelopes and upload to DevCopilot workspace 2."""
from __future__ import annotations

import json
import re
import sys

from devcopilot_upload import WS, api, load_data, upload_apis

ENVELOPE_KEYS = {"success", "status", "code", "message", "data"}


def is_full_envelope(raw: str, expect_success: bool) -> tuple[bool, str]:
    if not raw or not raw.strip():
        return False, "empty"
    try:
        obj = json.loads(raw)
    except json.JSONDecodeError as e:
        return False, f"invalid JSON: {e}"
    if not isinstance(obj, dict):
        return False, "not object"
    missing = ENVELOPE_KEYS - set(obj.keys())
    extra = set(obj.keys()) - ENVELOPE_KEYS
    if missing:
        return False, f"missing keys: {sorted(missing)}"
    if extra:
        return False, f"extra keys: {sorted(extra)}"
    if obj.get("success") is not expect_success:
        return False, f"success={obj.get('success')} expected {expect_success}"
    if not isinstance(obj.get("status"), int):
        return False, "status not int"
    if not isinstance(obj.get("code"), str) or not obj.get("code"):
        return False, "code invalid"
    if not isinstance(obj.get("message"), str):
        return False, "message invalid"
    return True, "ok"


def main() -> None:
    data = load_data()
    items = [x for x in data.get("apis", []) if re.match(r"^API-0\d\d$", x.get("api_id", ""))]
    items.sort(key=lambda x: x["api_id"])
    print(f"=== Envelope check: {len(items)} APIs ===")
    bad: list[tuple[str, str, str]] = []
    for item in items:
        aid = item["api_id"]
        ok_s, msg_s = is_full_envelope(item.get("response_success") or "", True)
        ok_e, msg_e = is_full_envelope(item.get("response_error") or "", False)
        if ok_s and ok_e:
            print(f"  OK {aid}")
        else:
            bad.append((aid, msg_s if not ok_s else "", msg_e if not ok_e else ""))
            print(f"  FAIL {aid}: success={msg_s}, error={msg_e}")
    if bad:
        print("Envelope validation FAILED")
        sys.exit(1)
    print("Envelope validation PASSED\n")

    count, mapping = upload_apis(data)
    print(f"\nUploaded: {count}\n=== GET verification (list endpoint) ===")

    r_list = api("GET", f"/api/workspaces/{WS}/apis")
    print(f"GET /apis list status={r_list.status_code}")
    if r_list.status_code != 200:
        print(f"  FAIL: {r_list.text[:200]}")
        return
    by_server = {row["id"]: row for row in r_list.json()}
    for api_id, server_id in [("API-001", mapping.get("API-001")), ("API-003", mapping.get("API-003"))]:
        row = by_server.get(server_id)
        if not row:
            print(f"  {api_id} server_id={server_id}: NOT FOUND in list")
            continue
        rs = row.get("response_success", "")
        re_ = row.get("response_error", "")
        ok_s, msg_s = is_full_envelope(rs, True)
        ok_e, msg_e = is_full_envelope(re_, False)
        print(f"  {api_id} server_id={server_id}")
        print(f"    response_success envelope: {ok_s}")
        print(f"    response_error envelope: {ok_e}")
        if api_id == "API-001":
            print(f"    success snippet: {rs[:120].replace(chr(10), ' ')}...")
        if api_id == "API-003":
            print(f"    error snippet: {re_[:120].replace(chr(10), ' ')}...")

    print("\n=== Mapping (api_id -> server_id) ===")
    for k in sorted(mapping):
        print(f"  {k} -> {mapping[k]}")


if __name__ == "__main__":
    main()
