#!/usr/bin/env python3
"""ASAK 프론트 정적 사이트 배포 (Netlify / Surge)."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DOCS_DIR = ROOT / "docs"


def run(cmd: list[str], **kwargs) -> subprocess.CompletedProcess:
    print("$", " ".join(cmd))
    return subprocess.run(cmd, **kwargs)


def build() -> None:
    subprocess.check_call([sys.executable, str(ROOT / "build_viewer.py")])


def deploy_netlify(prod: bool) -> int:
    token = os.environ.get("NETLIFY_AUTH_TOKEN")
    if not token:
        print("NETLIFY_AUTH_TOKEN 환경 변수가 없습니다.")
        print()
        print("Netlify Drop (가장 쉬움, 저장소 public 불필요):")
        print(f"  1. 브라우저에서 https://app.netlify.com/drop 열기")
        print(f"  2. 폴더 드래그: {DOCS_DIR.resolve()}")
        print("  3. 생성된 URL 공유")
        webbrowser.open("https://app.netlify.com/drop")
        return 0

    cmd = [
        "npx",
        "--yes",
        "netlify-cli",
        "deploy",
        "--dir",
        str(DOCS_DIR),
        "--message",
        "ASAK viewer deploy",
    ]
    if prod:
        cmd.append("--prod")
    return run(cmd, cwd=ROOT).returncode


def deploy_surge(domain: str | None) -> int:
    if not shutil.which("npx"):
        print("npm/npx가 필요합니다.")
        return 1
    cmd = ["npx", "--yes", "surge", str(DOCS_DIR)]
    if domain:
        cmd.extend(["--domain", domain])
    print("Surge 최초 1회: 이메일·비밀번호 입력 후 같은 명령을 다시 실행하세요.")
    return run(cmd, cwd=ROOT).returncode


def main() -> None:
    parser = argparse.ArgumentParser(description="ASAK 뷰어 배포")
    parser.add_argument(
        "--target",
        choices=("netlify", "surge"),
        default="netlify",
        help="배포 대상 (기본: netlify)",
    )
    parser.add_argument("--prod", action="store_true", help="Netlify 프로덕션 배포")
    parser.add_argument("--domain", help="Surge 도메인 (예: salady-viewer.surge.sh)")
    parser.add_argument("--no-build", action="store_true")
    args = parser.parse_args()

    if not args.no_build:
        build()

    if not DOCS_DIR.is_dir():
        raise SystemExit(f"docs 폴더 없음: {DOCS_DIR}")

    if args.target == "netlify":
        raise SystemExit(deploy_netlify(args.prod))
    raise SystemExit(deploy_surge(args.domain))


if __name__ == "__main__":
    main()
