#!/usr/bin/env python3
"""ASAK 프론트 로컬 뷰어 서버."""

from __future__ import annotations

import argparse
import json
import mimetypes
import re
import shutil
import socket
import subprocess
import threading
import webbrowser
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
VIEWER_DIR = ROOT / "viewer"
DATA_DIR = ROOT / "data"


class ViewerHandler(SimpleHTTPRequestHandler):
    output_dir: Path = DATA_DIR
    viewer_dir: Path = VIEWER_DIR

    def log_message(self, format: str, *args) -> None:
        if args and str(args[0]).startswith("2"):
            return
        super().log_message(format, *args)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        if path.startswith("/data/"):
            self._serve_data(path[len("/data/") :])
            return
        if path in ("", "/"):
            self._serve_file(self.viewer_dir / "index.html")
            return
        if path.startswith("/"):
            rel = path.lstrip("/")
            candidate = self.viewer_dir / rel
            if candidate.is_file():
                self._serve_file(candidate)
                return
        self.send_error(404, "Not Found")

    def _serve_data(self, rel: str) -> None:
        rel = rel.lstrip("/")
        if ".." in rel.replace("\\", "/"):
            self.send_error(403, "Forbidden")
            return
        target = (self.output_dir / rel).resolve()
        if not str(target).startswith(str(self.output_dir.resolve())):
            self.send_error(403, "Forbidden")
            return
        if not target.is_file():
            self.send_error(404, "Not Found")
            return
        self._serve_file(target)

    def _serve_file(self, path: Path) -> None:
        data = path.read_bytes()
        mime, _ = mimetypes.guess_type(str(path))
        if path.suffix == ".json":
            mime = "application/json; charset=utf-8"
        elif path.suffix in {".html", ""}:
            mime = "text/html; charset=utf-8"
        elif path.suffix == ".js":
            mime = "application/javascript; charset=utf-8"
        elif path.suffix == ".css":
            mime = "text/css; charset=utf-8"
        self.send_response(200)
        self.send_header("Content-Type", mime or "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(data)


def build_meta() -> dict:
    meta: dict = {"generated": True, "files": {}, "stats": {}}
    for name in (
        "menus.json",
        "dressings.json",
        "store_menus.json",
        "dressing_nutrition_supplements.json",
    ):
        path = DATA_DIR / name
        if path.exists():
            meta["files"][name] = {
                "size_bytes": path.stat().st_size,
                "exists": True,
            }
    if (DATA_DIR / "menus.json").exists():
        menus = json.loads((DATA_DIR / "menus.json").read_text(encoding="utf-8"))
        meta["stats"] = {
            "menus": len(menus),
            "with_dressing": sum(
                1
                for m in menus
                if m.get("recommended_dressing") or m.get("included_dressing")
            ),
            "with_store_pricing": sum(1 for m in menus if m.get("store_pricing")),
        }
    if (DATA_DIR / "dressings.json").exists():
        dressings = json.loads((DATA_DIR / "dressings.json").read_text(encoding="utf-8"))
        meta["stats"]["dressings"] = dressings.get("count", len(dressings.get("items", [])))
    if (DATA_DIR / "store_menus.json").exists():
        stores = json.loads((DATA_DIR / "store_menus.json").read_text(encoding="utf-8"))
        meta["stats"]["stores"] = len(stores.get("stores", []))
        meta["stats"]["store_items"] = sum(
            len(s.get("items", [])) for s in stores.get("stores", [])
        )
    return meta


def local_ip() -> str:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("8.8.8.8", 80))
        return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        sock.close()


def start_cloudflared_tunnel(port: int) -> None:
    if not shutil.which("cloudflared"):
        print("공개 링크: cloudflared 미설치")
        print("  설치: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/")
        print(f"  또는 같은 Wi-Fi에서 http://{local_ip()}:{port}")
        return

    proc = subprocess.Popen(
        ["cloudflared", "tunnel", "--url", f"http://127.0.0.1:{port}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    def _read() -> None:
        assert proc.stdout is not None
        for line in proc.stdout:
            match = re.search(r"https://[a-z0-9-]+\.trycloudflare\.com", line)
            if match:
                print(f"\n공개 링크 (다른 사람에게 공유): {match.group(0)}/")
                print("종료하면 링크도 사라집니다.\n")
                break

    threading.Thread(target=_read, daemon=True).start()


def main() -> None:
    parser = argparse.ArgumentParser(description="ASAK 데이터 뷰어")
    parser.add_argument("-p", "--port", type=int, default=8765)
    parser.add_argument("--host", default="127.0.0.1", help="0.0.0.0 이면 같은 Wi-Fi에서 접속 가능")
    parser.add_argument("--share", action="store_true", help="cloudflared로 임시 공개 URL 생성")
    parser.add_argument("--no-open", action="store_true")
    args = parser.parse_args()

    if not VIEWER_DIR.exists():
        raise SystemExit(f"viewer 폴더가 없습니다: {VIEWER_DIR}")
    if not DATA_DIR.exists():
        print(f"data 폴더 없음: {DATA_DIR}")
        print("크롤링 산출물은 프론트에 직접 포함하지 않습니다. 필요 시 별도로 복사하세요.")

    meta_path = VIEWER_DIR / "meta.json"
    meta_path.write_text(
        json.dumps(build_meta(), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    handler = partial(ViewerHandler, directory=str(VIEWER_DIR))
    server = ThreadingHTTPServer((args.host, args.port), handler)
    url = f"http://127.0.0.1:{args.port}/"
    print(f"뷰어 실행: {url}")
    if args.host == "0.0.0.0":
        print(f"  같은 Wi-Fi: http://{local_ip()}:{args.port}/")
    if args.share:
        start_cloudflared_tunnel(args.port)
    print("종료: Ctrl+C")
    if not args.no_open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n종료합니다.")


if __name__ == "__main__":
    main()
