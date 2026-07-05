(function () {
  "use strict";

  const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const DATA_URL = "data.json";
  const DAILY_BASE = "../daily/";

  let calendarData = null;
  let viewYear = new Date().getFullYear();
  let viewMonth = new Date().getMonth();
  let selectedDate = null;

  const els = {
    monthLabel: document.getElementById("month-label"),
    calendarGrid: document.getElementById("calendar-grid"),
    detailPanel: document.getElementById("detail-panel"),
    legendList: document.getElementById("legend-list"),
    statusBar: document.getElementById("status-bar"),
    loadStatus: document.getElementById("load-status"),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toDateKey(y, m, d) {
    return `${y}-${pad(m + 1)}-${pad(d)}`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderMarkdown(md) {
    const lines = md.split("\n");
    const out = [];
    let inTable = false;
    let tableRows = [];

    function flushTable() {
      if (!tableRows.length) return;
      const [head, ...body] = tableRows;
      const ths = head.map((c) => `<th>${escapeHtml(c.trim())}</th>`).join("");
      const trs = body
        .map((row) => `<tr>${row.map((c) => `<td>${inlineMd(c.trim())}</td>`).join("")}</tr>`)
        .join("");
      out.push(`<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`);
      tableRows = [];
      inTable = false;
    }

    function inlineMd(text) {
      return escapeHtml(text)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    }

    for (const raw of lines) {
      const line = raw.trimEnd();
      if (/^\|.+\|$/.test(line.trim())) {
        const cells = line.trim().slice(1, -1).split("|");
        if (cells.every((c) => /^[\s:-]+$/.test(c))) continue;
        tableRows.push(cells);
        inTable = true;
        continue;
      }
      if (inTable) flushTable();

      if (line.startsWith("# ")) {
        out.push(`<h1>${inlineMd(line.slice(2))}</h1>`);
      } else if (line.startsWith("## ")) {
        out.push(`<h2>${inlineMd(line.slice(3))}</h2>`);
      } else if (line.startsWith("### ")) {
        out.push(`<h3>${inlineMd(line.slice(4))}</h3>`);
      } else if (line.startsWith("> ")) {
        out.push(`<blockquote>${inlineMd(line.slice(2))}</blockquote>`);
      } else if (/^[-*] /.test(line)) {
        out.push(`<ul><li>${inlineMd(line.slice(2))}</li></ul>`);
      } else if (line === "") {
        out.push("");
      } else {
        out.push(`<p>${inlineMd(line)}</p>`);
      }
    }
    if (inTable) flushTable();
    return out.join("\n");
  }

  function getDayMeta(dateKey) {
    return calendarData?.days?.[dateKey] || null;
  }

  function memberColor(name) {
    return calendarData?.member_colors?.[name] || "#2d8a4e";
  }

  function renderLegend() {
    const members = calendarData?.members || [];
    els.legendList.innerHTML = members.length
      ? members
          .map(
            (m) =>
              `<li class="legend-item"><span class="legend-dot" style="background:${memberColor(m)}"></span>${escapeHtml(m)}</li>`
          )
          .join("")
      : '<li class="legend-item" style="opacity:0.7">daily 표에 담당자를 추가하세요</li>';
  }

  function renderStatusBar() {
    const count = Object.keys(calendarData?.days || {}).length;
    const blockers = Object.values(calendarData?.days || {}).filter((d) => d.has_blocker).length;
    els.statusBar.innerHTML = [
      `<span class="chip">기록 ${count}일</span>`,
      blockers ? `<span class="chip warn">블로커 ${blockers}일</span>` : "",
      `<span class="chip">갱신: ${(calendarData?.generated_at || "").slice(0, 19).replace("T", " ")} UTC</span>`,
    ]
      .filter(Boolean)
      .join("");
  }

  function renderCalendar() {
    els.monthLabel.textContent = `${viewYear}년 ${viewMonth + 1}월`;
    els.calendarGrid.innerHTML = "";

    WEEKDAYS.forEach((name, i) => {
      const el = document.createElement("div");
      el.className = "weekday" + (i === 0 ? " sun" : i === 6 ? " sat" : "");
      el.textContent = name;
      els.calendarGrid.appendChild(el);
    });

    const first = new Date(viewYear, viewMonth, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    const todayKey = toDateKey(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );

    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      let y = viewYear;
      let m = viewMonth;
      let d;
      let other = false;

      if (i < startOffset) {
        d = prevMonthDays - startOffset + i + 1;
        m = viewMonth - 1;
        if (m < 0) {
          m = 11;
          y -= 1;
        }
        other = true;
      } else if (i >= startOffset + daysInMonth) {
        d = i - startOffset - daysInMonth + 1;
        m = viewMonth + 1;
        if (m > 11) {
          m = 0;
          y += 1;
        }
        other = true;
      } else {
        d = i - startOffset + 1;
      }

      const dateKey = toDateKey(y, m, d);
      const meta = getDayMeta(dateKey);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "day-cell";
      if (other) cell.classList.add("other-month");
      if (dateKey === todayKey) cell.classList.add("today");
      if (dateKey === selectedDate) cell.classList.add("selected");
      if (meta) cell.classList.add("has-log");

      const dots =
        meta?.members
          ?.map(
            (name) =>
              `<span class="member-dot" style="background:${memberColor(name)}" title="${escapeHtml(name)}"></span>`
          )
          .join("") || "";

      cell.innerHTML = `
        <span class="day-num">${d}</span>
        <div class="day-dots">${dots}${meta?.has_blocker ? '<span class="blocker-badge">!</span>' : ""}</div>
      `;
      cell.addEventListener("click", () => selectDate(dateKey));
      els.calendarGrid.appendChild(cell);
    }
  }

  async function selectDate(dateKey) {
    selectedDate = dateKey;
    renderCalendar();

    const meta = getDayMeta(dateKey);
    if (!meta) {
      els.detailPanel.innerHTML = `
        <h2>${dateKey}</h2>
        <p class="placeholder">이 날짜의 daily 기록이 없습니다.<br><code>worklog/daily/${dateKey}.md</code>를 작성한 뒤 build 스크립트를 실행하세요.</p>
      `;
      return;
    }

    els.detailPanel.innerHTML = `
      <h2>${escapeHtml(meta.title)}</h2>
      <div class="detail-meta">${dateKey} · ${meta.row_count}건 · ${meta.members.join(", ")}</div>
      ${meta.summary ? `<div class="detail-summary">${escapeHtml(meta.summary)}</div>` : ""}
      ${renderRowsTable(meta.rows)}
      <div class="detail-body" id="detail-body"><p class="placeholder">본문 로딩 중…</p></div>
    `;

    try {
      const res = await fetch(`${DAILY_BASE}${dateKey}.md`);
      if (!res.ok) throw new Error("not found");
      const md = await res.text();
      document.getElementById("detail-body").innerHTML = renderMarkdown(md);
    } catch {
      document.getElementById("detail-body").innerHTML =
        '<p class="placeholder">daily 파일을 불러오지 못했습니다.</p>';
    }
  }

  function renderRowsTable(rows) {
    if (!rows?.length) return "";
    const keys = Object.keys(rows[0]);
    const head = keys.map((k) => `<th>${escapeHtml(k)}</th>`).join("");
    const body = rows
      .map(
        (row) =>
          `<tr>${keys
            .map((k) => {
              const val = row[k] || "";
              const color =
                k === "담당자" ? ` style="border-left:3px solid ${memberColor(val)}"` : "";
              return `<td${color}>${escapeHtml(val)}</td>`;
            })
            .join("")}</tr>`
      )
      .join("");
    return `<table class="detail-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }

  async function loadData() {
    try {
      const res = await fetch(`${DATA_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error("data.json missing");
      calendarData = await res.json();
      els.loadStatus.textContent = `기록 ${Object.keys(calendarData.days || {}).length}일 로드됨`;
      renderLegend();
      renderStatusBar();
      renderCalendar();

      const keys = Object.keys(calendarData.days || {}).sort();
      if (keys.length) {
        const latest = keys[keys.length - 1];
        const [y, mo] = latest.split("-").map(Number);
        viewYear = y;
        viewMonth = mo - 1;
        selectedDate = latest;
        renderCalendar();
        await selectDate(latest);
      }
    } catch (err) {
      els.loadStatus.textContent = "data.json 로드 실패 — build_calendar.py 실행";
      console.error(err);
    }
  }

  document.getElementById("btn-prev").addEventListener("click", () => {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    renderCalendar();
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    renderCalendar();
  });

  document.getElementById("btn-today").addEventListener("click", () => {
    const now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
    selectedDate = toDateKey(viewYear, viewMonth, now.getDate());
    renderCalendar();
    selectDate(selectedDate);
  });

  loadData();
})();
