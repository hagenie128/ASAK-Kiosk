"""Shared paths and person resolution for worklog scripts."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DAILY_DIR = ROOT / "daily"
ENTRIES_DIR = ROOT / "entries"
TEMPLATES_DIR = ROOT / "templates"
CONFIG_PATH = ROOT / "team_config.json"
NOTION_CONFIG_PATH = ROOT / "notion_config.json"

TEAM_DIR_DEFAULT = "_team"
NOTION_ASSIGNEES = frozenset({"이하진", "김나연", "박유진", "강민준", "미지정"})


def load_team_config() -> dict:
    if not CONFIG_PATH.is_file():
        return {"members": [], "team_dir": TEAM_DIR_DEFAULT, "git_user_map": {}}
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def team_members(config: dict | None = None) -> list[str]:
    cfg = config or load_team_config()
    return list(cfg.get("members", []))


def team_dir_name(config: dict | None = None) -> str:
    cfg = config or load_team_config()
    return str(cfg.get("team_dir", TEAM_DIR_DEFAULT))


def git_identity() -> tuple[str, str]:
    def run(key: str) -> str:
        try:
            result = subprocess.run(
                ["git", "config", key],
                capture_output=True,
                text=True,
                check=False,
                cwd=ROOT.parent,
            )
            return (result.stdout or "").strip()
        except OSError:
            return ""

    return run("user.name"), run("user.email")


def resolve_person(explicit: str | None = None) -> str:
    if explicit:
        value = explicit.strip()
        if value in ("team", "_team", "미지정", "팀"):
            return team_dir_name()
        return value

    config = load_team_config()
    name, email = git_identity()
    mapping: dict[str, str] = config.get("git_user_map", {})
    for key in (name, email):
        if key and key in mapping:
            return mapping[key]
    if name in team_members(config):
        return name
    members = team_members(config)
    raise ValueError(
        "담당자를 알 수 없습니다. --person 이름 을 지정하거나 "
        f"worklog/team_config.json git_user_map 에 Git 사용자를 등록하세요. "
        f"(git user.name={name!r}, members={members})"
    )


def daily_path(person: str, day: str) -> Path:
    return DAILY_DIR / person / f"{day}.md"


def entries_path(person: str, filename: str) -> Path:
    return ENTRIES_DIR / person / filename


def list_daily_persons(config: dict | None = None) -> list[str]:
    cfg = config or load_team_config()
    persons = list(team_members(cfg))
    team = team_dir_name(cfg)
    if team not in persons:
        persons.append(team)
    return persons


def git_daily_url(config: dict, person: str, day: str) -> str:
    base = config.get("git_daily_base_url", "").rstrip("/")
    return f"{base}/{person}/{day}.md"


def map_assignee(raw: str, folder_person: str | None = None) -> str:
    name = raw.strip()
    if name in NOTION_ASSIGNEES:
        return name
    aliases = {"팀 공통": "미지정", "공통": "미지정", "team": "미지정"}
    if name in aliases:
        return aliases[name]
    for notion_name in NOTION_ASSIGNEES - {"미지정"}:
        if notion_name in name:
            return notion_name
    if folder_person == team_dir_name():
        return "미지정"
    if folder_person and folder_person in NOTION_ASSIGNEES - {"미지정"}:
        return folder_person
    return "미지정"
