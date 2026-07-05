# ASAK 일일 워크로그 → Notion 동기화 (Windows one-liner wrapper)
# 사용: .\worklog\scripts\sync_today.ps1
# 사전: NOTION_TOKEN 환경 변수 또는 --json + Notion MCP

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $repoRoot
python worklog/scripts/sync_daily_to_notion.py --date today @args
