/* ASAK data viewer */

const state = {
  menus: [],
  dressings: { items: [], name_map: {} },
  storeMenus: { stores: [] },
  supplements: null,
  view: "dashboard",
  menuFilter: "all",
  menuQuery: "",
  selectedMenuId: null,
  storeFilter: "all",
  storeQuery: "",
  selectedStoreKey: null,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtKrw(n) {
  if (n == null || Number.isNaN(Number(n))) return "-";
  return `${Number(n).toLocaleString("ko-KR")}원`;
}

function fmtNum(n, digits = 1) {
  if (n == null || n === "") return "-";
  const v = Number(n);
  if (Number.isNaN(v)) return esc(n);
  return Number.isInteger(v) ? String(v) : v.toFixed(digits);
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} (${res.status})`);
  return res.json();
}

const DATA = "data";

async function bootstrap() {
  const status = $("#load-status");
  try {
    const [menus, dressings, storeMenus, supplements] = await Promise.all([
      loadJson(`${DATA}/menus.json`),
      loadJson(`${DATA}/dressings.json`),
      loadJson(`${DATA}/store_menus.json`),
      loadJson(`${DATA}/dressing_nutrition_supplements.json`).catch(() => null),
    ]);
    state.menus = menus;
    state.dressings = dressings;
    state.storeMenus = storeMenus;
    state.supplements = supplements;
    status.textContent = `메뉴 ${menus.length} · 드레싱 ${dressings.items?.length ?? 0} · 매장 ${storeMenus.stores?.length ?? 0}`;
    bindNav();
    bindSearch();
    renderAll();
  } catch (err) {
    status.textContent = `로드 실패: ${err.message}`;
    $("#view-dashboard").innerHTML = `<div class="panel"><p>데이터를 불러오지 못했습니다. <code>python run_viewer.py</code> 로 서버를 실행했는지 확인하세요.</p><p class="meta-line">프론트에는 1차 크롤링 산출물이 기본 포함되지 않습니다. 필요하면 <code>sync_phase1_data_to_front.bat</code> 또는 통합 저장소의 output 복사로 <code>data</code> 폴더를 채우세요.</p></div>`;
  }
}

function bindNav() {
  $$(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      state.view = view;
      $$(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
      $$(".view").forEach((v) => v.classList.remove("active"));
      $(`#view-${view}`).classList.add("active");
      const titles = {
        dashboard: "대시보드",
        menus: "메뉴",
        dressings: "드레싱",
        stores: "매장",
      };
      $("#page-title").textContent = titles[view] || view;
      $("#search-wrap").hidden = view !== "menus" && view !== "stores";
      renderAll();
    });
  });
}

function bindSearch() {
  $("#search-input").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (state.view === "menus") {
      state.menuQuery = q;
      renderMenuList();
    } else if (state.view === "stores") {
      state.storeQuery = q;
      renderStoreList();
    }
  });
}

function renderAll() {
  if (state.view === "dashboard") renderDashboard();
  if (state.view === "menus") {
    renderMenuFilters();
    renderMenuList();
    if (state.selectedMenuId) renderMenuDetail(state.selectedMenuId);
  }
  if (state.view === "dressings") renderDressings();
  if (state.view === "stores") {
    renderStoreFilters();
    renderStoreList();
    if (state.selectedStoreKey) renderStoreDetail(state.selectedStoreKey);
  }
}

function renderDashboard() {
  const menus = state.menus;
  const dressings = state.dressings.items || [];
  const stores = state.storeMenus.stores || [];
  const categories = new Set(menus.map((m) => m.category).filter(Boolean));
  const withPricing = menus.filter((m) => m.store_pricing && Object.keys(m.store_pricing).length).length;
  const withNaver = menus.filter((m) =>
    Object.values(m.store_pricing || {}).some((p) => p.naver_options)
  ).length;
  const dressingNames = dressings.map((d) => d.name);
  const supplementCount = state.supplements?.items?.length ?? 0;

  $("#view-dashboard").innerHTML = `
    <div class="stats">
      <div class="stat-card"><span>공식 메뉴</span><strong>${menus.length}</strong></div>
      <div class="stat-card"><span>카테고리</span><strong>${categories.size}</strong></div>
      <div class="stat-card"><span>드레싱</span><strong>${dressings.length}</strong></div>
      <div class="stat-card"><span>매장</span><strong>${stores.length}</strong></div>
      <div class="stat-card"><span>매장 가격 연동</span><strong>${withPricing}</strong></div>
      <div class="stat-card"><span>네이버 옵션</span><strong>${withNaver}</strong></div>
    </div>
    <div class="panel">
      <h2 class="section-title">빠른 탐색</h2>
      <p class="meta-line">왼쪽 메뉴에서 탭을 선택하거나 아래 버튼으로 이동하세요.</p>
      <div class="filters" style="margin-top:12px">
        <button type="button" class="chip" data-goto="menus">메뉴 목록</button>
        <button type="button" class="chip" data-goto="dressings">드레싱 카탈로그</button>
        <button type="button" class="chip" data-goto="stores">매장별 메뉴</button>
      </div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2 class="section-title">드레싱 목록</h2>
      <p class="meta-line">${dressingNames.join(" · ")}</p>
      ${supplementCount ? `<p class="source-note">FatSecret 보조 영양 ${supplementCount}건 적용됨</p>` : ""}
    </div>
    <div class="panel" style="margin-top:16px">
      <h2 class="section-title">매장</h2>
      ${stores
        .map(
          (s) =>
            `<p><strong>${esc(s.store_name)}</strong> <span class="meta-line">(${esc(s.platform)} · ${s.item_count ?? s.items?.length ?? 0}품목)</span></p>`
        )
        .join("")}
    </div>
  `;

  $$("#view-dashboard [data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      $(`.nav-btn[data-view="${btn.dataset.goto}"]`).click();
    });
  });
}

function menuCategories() {
  const counts = {};
  for (const m of state.menus) {
    const c = m.nav_category || m.category || "기타";
    counts[c] = (counts[c] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function renderMenuFilters() {
  const cats = menuCategories();
  const chips = [
    `<button type="button" class="chip ${state.menuFilter === "all" ? "active" : ""}" data-cat="all">전체 (${state.menus.length})</button>`,
    ...cats.map(
      ([name, n]) =>
        `<button type="button" class="chip ${state.menuFilter === name ? "active" : ""}" data-cat="${esc(name)}">${esc(name)} (${n})</button>`
    ),
  ];
  $("#menu-filters").innerHTML = chips.join("");
  $$("#menu-filters .chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.menuFilter = btn.dataset.cat;
      renderMenuFilters();
      renderMenuList();
    });
  });
}

function filteredMenus() {
  const q = state.menuQuery;
  return state.menus.filter((m) => {
    const cat = m.nav_category || m.category || "";
    if (state.menuFilter !== "all" && cat !== state.menuFilter) return false;
    if (!q) return true;
    const hay = [
      m.name_ko,
      m.name_en,
      m.category,
      m.nav_category,
      m.default_dressing,
      m.recommended_dressing,
      m.included_dressing,
      m.toppings_text,
      ...(m.tags || []),
      ...(m.allergy || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

function renderMenuList() {
  const list = filteredMenus();
  const html = list
    .slice(0, 400)
    .map((m) => {
      const kcal =
        m.nutrition_pdf?.calories_kcal ??
        m.nutrition?.["열량(kcal)"] ??
        m.calorie_calculator?.base_kcal;
      const dressing = m.default_dressing || m.included_dressing || m.recommended_dressing;
      const active = state.selectedMenuId === m.id ? "active" : "";
      return `
        <article class="menu-item ${active}" data-id="${esc(m.id)}">
          <img src="${esc(m.image_url || "")}" alt="" loading="lazy" onerror="this.style.visibility='hidden'" />
          <div>
            <h3>${esc(m.name_ko)}</h3>
            <div class="meta-line">${esc(m.nav_category || m.category || "")}${kcal != null ? ` · ${fmtNum(kcal)} kcal` : ""}</div>
            <div class="badges">
              ${(m.tags || []).map((t) => `<span class="badge accent">${esc(t)}</span>`).join("")}
              ${dressing ? `<span class="badge">${esc(dressing)}</span>` : ""}
              ${m.store_pricing ? `<span class="badge">매장가격</span>` : ""}
            </div>
          </div>
        </article>`;
    })
    .join("");
  const more = list.length > 400 ? `<p class="placeholder" style="padding:12px">상위 400개만 표시 (검색·필터로 좁혀보세요)</p>` : "";
  $("#menu-list").innerHTML = html + more || `<p class="placeholder" style="padding:12px">결과 없음</p>`;
  $$("#menu-list .menu-item").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedMenuId = el.dataset.id;
      renderMenuList();
      renderMenuDetail(el.dataset.id);
    });
  });
}

function findDressing(name) {
  if (!name) return null;
  const items = state.dressings.items || [];
  const norm = name.replace(/\s+/g, "");
  return (
    items.find((d) => d.name === name || d.name_normalized === norm) ||
    items.find((d) => d.name.replace(/\s+/g, "") === norm)
  );
}

function nutritionRows(menu) {
  const pdf = menu.nutrition_pdf;
  const nut = menu.nutrition;
  const rows = [];
  if (pdf) {
    rows.push(["중량", pdf.weight_g != null ? `${fmtNum(pdf.weight_g)} g` : "-"]);
    rows.push(["열량", pdf.calories_kcal != null ? `${fmtNum(pdf.calories_kcal)} kcal` : "-"]);
    rows.push(["탄수화물", pdf.carbs_g != null ? `${fmtNum(pdf.carbs_g)} g` : "-"]);
    rows.push(["당류", pdf.sugar_g != null ? `${fmtNum(pdf.sugar_g)} g` : "-"]);
    rows.push(["단백질", pdf.protein_g != null ? `${fmtNum(pdf.protein_g)} g` : "-"]);
    rows.push(["지방", pdf.fat_g != null ? `${fmtNum(pdf.fat_g)} g` : "-"]);
    rows.push(["포화지방", pdf.saturated_fat_g != null ? `${fmtNum(pdf.saturated_fat_g)} g` : "-"]);
    rows.push(["나트륨", pdf.sodium_mg != null ? `${fmtNum(pdf.sodium_mg)} mg` : "-"]);
  } else if (nut) {
    for (const [k, v] of Object.entries(nut)) {
      rows.push([k.replace(/\(.*\)/, "").trim(), esc(v)]);
    }
  }
  return rows;
}

function renderStorePricingBlock(storePricing) {
  if (!storePricing || !Object.keys(storePricing).length) {
    return "<p class='meta-line'>매장 가격 정보 없음</p>";
  }
  const rows = Object.entries(storePricing).map(([key, p]) => {
    const label = key.includes("__") ? key.split("__").slice(1).join(" / ") : key;
    const extra = p.set_info
      ? `<br><span class="meta-line">세트: ${esc(p.set_info.set_components?.join(", ") || "")}</span>`
      : "";
    const naver = p.naver_options ? `<span class="badge warn">네이버 옵션</span>` : "";
    return `<tr>
      <th>${esc(label)}</th>
      <td>${fmtKrw(p.price_krw)} · ${esc(p.category || "")} ${naver}${extra}</td>
    </tr>`;
  });
  return `<table><tbody>${rows.join("")}</tbody></table>`;
}

function renderNaverOptions(storePricing) {
  const groups = [];
  for (const p of Object.values(storePricing || {})) {
    if (p.naver_options?.option_groups) groups.push(...p.naver_options.option_groups);
  }
  if (!groups.length) return "";
  const uniq = new Map();
  for (const g of groups) {
    if (!uniq.has(g.name)) uniq.set(g.name, g);
  }
  return `
    <h3 class="section-title">네이버 옵션</h3>
    ${[...uniq.values()]
      .map(
        (g) => `
      <div class="option-group">
        <h4>${esc(g.name)}${g.required ? " <span class='badge warn'>필수</span>" : ""}</h4>
        <ul class="option-list">
          ${(g.items || [])
            .map(
              (it) =>
                `<li>${esc(it.name)}${it.price ? ` (+${fmtKrw(it.price)})` : ""}</li>`
            )
            .join("")}
        </ul>
      </div>`
      )
      .join("")}`;
}

function renderDressingBlock(menu) {
  const names = [
    menu.default_dressing,
    menu.included_dressing,
    menu.recommended_dressing,
  ].filter(Boolean);
  const unique = [...new Set(names)];
  if (!unique.length) return "<p class='meta-line'>드레싱 정보 없음</p>";
  return unique
    .map((name) => {
      const d = findDressing(name);
      if (!d) return `<p><strong>${esc(name)}</strong> <span class="meta-line">(카탈로그 미등록)</span></p>`;
      const n = d.nutrition_pdf || d.nutrition_supplement;
      const src = d.nutrition_source || d.source;
      let nut = "";
      if (n) {
        nut = `<span class="meta-line">50g 기준 ${fmtNum(n.calories_kcal)} kcal · 탄수 ${fmtNum(n.carbs_g)}g · 지방 ${fmtNum(n.fat_g)}g</span>`;
      } else if (d.nutrition_notes) {
        nut = `<span class="meta-line">${esc(d.nutrition_notes)}</span>`;
      }
      const allergens = (d.allergens || []).length
        ? `<div class="badges">${d.allergens.map((a) => `<span class="badge warn">${esc(a)}</span>`).join("")}</div>`
        : "";
      return `<div style="margin-bottom:12px">
        <strong>${esc(d.name)}</strong> ${src ? `<span class="badge">${esc(src)}</span>` : ""}
        ${nut}
        ${allergens}
      </div>`;
    })
    .join("");
}

function renderMenuDetail(id) {
  const menu = state.menus.find((m) => String(m.id) === String(id));
  const panel = $("#menu-detail");
  if (!menu) {
    panel.innerHTML = `<p class="placeholder">메뉴를 찾을 수 없습니다</p>`;
    return;
  }

  const nutRows = nutritionRows(menu);
  const cc = menu.calorie_calculator;

  panel.innerHTML = `
    <div class="detail-hero">
      <img src="${esc(menu.image_url || "")}" alt="" onerror="this.style.display='none'" />
      <div>
        <h2>${esc(menu.name_ko)}</h2>
        <p class="meta-line">${esc(menu.name_en || "")}</p>
        <div class="badges">
          <span class="badge accent">${esc(menu.nav_category || menu.category || "")}</span>
          ${(menu.tags || []).map((t) => `<span class="badge">${esc(t)}</span>`).join("")}
        </div>
        ${menu.url ? `<p style="margin-top:10px"><a href="${esc(menu.url)}" target="_blank" rel="noopener">공식 페이지 ↗</a></p>` : ""}
      </div>
    </div>

    ${menu.description ? `<p>${esc(menu.description)}</p>` : ""}
    ${menu.toppings_text ? `<p class="meta-line"><strong>토핑</strong> ${esc(menu.toppings_text)}</p>` : ""}
    ${menu.base ? `<p class="meta-line"><strong>베이스</strong> ${esc(menu.base)}</p>` : ""}

    <h3 class="section-title">영양 정보</h3>
    ${
      nutRows.length
        ? `<table><tbody>${nutRows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${v}</td></tr>`).join("")}</tbody></table>`
        : "<p class='meta-line'>없음</p>"
    }

    ${
      cc
        ? `<h3 class="section-title">칼로리 계산기 (베이스 ${fmtNum(cc.base_kcal)} kcal)</h3>
           <table><tbody>${Object.entries(cc.addon_kcal || {})
             .map(([k, v]) => `<tr><th>${esc(k)}</th><td>+${fmtNum(v)} kcal</td></tr>`)
             .join("")}</tbody></table>`
        : ""
    }

    <h3 class="section-title">알레르기</h3>
    ${
      (menu.allergy || []).length
        ? `<div class="badges">${menu.allergy.map((a) => `<span class="badge warn">${esc(a)}</span>`).join("")}</div>`
        : "<p class='meta-line'>없음</p>"
    }

    <h3 class="section-title">드레싱</h3>
    ${renderDressingBlock(menu)}

    <h3 class="section-title">매장 가격</h3>
    ${renderStorePricingBlock(menu.store_pricing)}
    ${renderNaverOptions(menu.store_pricing)}

    ${
      (menu.set_variants || []).length
        ? `<h3 class="section-title">세트 구성 (${menu.set_variants.length}건)</h3>
           <table><tbody>${menu.set_variants
             .slice(0, 8)
             .map(
               (s) =>
                 `<tr><th>${esc(s.store_id)}</th><td>${esc(s.name)} · ${fmtKrw(s.price_krw)}<br><span class="meta-line">${esc((s.set_components || []).join(", "))}</span></td></tr>`
             )
             .join("")}</tbody></table>
           ${menu.set_variants.length > 8 ? `<p class="meta-line">외 ${menu.set_variants.length - 8}건</p>` : ""}`
        : ""
    }
  `;
}

function renderDressings() {
  const items = state.dressings.items || [];
  $("#view-dressings").innerHTML = `
    <p class="meta-line" style="margin-bottom:16px">총 ${items.length}종 · PDF·알레르기·FatSecret 보조 데이터 통합</p>
    <div class="dressing-grid">
      ${items
        .map((d) => {
          const n = d.nutrition_pdf || d.nutrition_supplement;
          const weight = n?.weight_g ?? 50;
          const allergens = (d.allergens || [])
            .map((a) => `<span class="badge warn">${esc(a)}</span>`)
            .join("");
          const nutTable = n
            ? `<table>
                <tr><th>중량</th><td>${fmtNum(n.weight_g ?? weight)} g</td></tr>
                <tr><th>열량</th><td>${fmtNum(n.calories_kcal)} kcal</td></tr>
                <tr><th>탄수화물</th><td>${fmtNum(n.carbs_g)} g</td></tr>
                <tr><th>지방</th><td>${fmtNum(n.fat_g)} g</td></tr>
                <tr><th>나트륨</th><td>${fmtNum(n.sodium_mg)} mg</td></tr>
              </table>`
            : `<p class="meta-line">${esc(d.nutrition_notes || "영양성분 미등록")}</p>`;
          return `
            <article class="dressing-card">
              <h3>${esc(d.name)}</h3>
              <div class="badges">
                <span class="badge">${esc(d.source || "")}</span>
                ${d.nutrition_source ? `<span class="badge accent">${esc(d.nutrition_source)}</span>` : ""}
              </div>
              ${nutTable}
              ${allergens ? `<div class="badges" style="margin-top:8px">${allergens}</div>` : ""}
            </article>`;
        })
        .join("")}
    </div>
  `;
}

function renderStoreFilters() {
  const stores = state.storeMenus.stores || [];
  const chips = [
    `<button type="button" class="chip ${state.storeFilter === "all" ? "active" : ""}" data-store="all">전체</button>`,
    ...stores.map(
      (s) =>
        `<button type="button" class="chip ${state.storeFilter === s.id ? "active" : ""}" data-store="${esc(s.id)}">${esc(s.store_name)}</button>`
    ),
  ];
  $("#store-filters").innerHTML = chips.join("");
  $$("#store-filters .chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.storeFilter = btn.dataset.store;
      state.selectedStoreKey = null;
      renderStoreFilters();
      renderStoreList();
      $("#store-detail").innerHTML = `<p class="placeholder">매장 메뉴를 선택하세요</p>`;
    });
  });
}

function allStoreItems() {
  const stores = state.storeMenus.stores || [];
  const out = [];
  for (const store of stores) {
    if (state.storeFilter !== "all" && store.id !== state.storeFilter) continue;
    for (const item of store.items || []) {
      out.push({ store, item });
    }
  }
  return out;
}

function filteredStoreItems() {
  const q = state.storeQuery.toLowerCase();
  return allStoreItems().filter(({ store, item }) => {
    if (!q) return true;
    const hay = [item.name, item.category, item.description, store.store_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

function renderStoreList() {
  const list = filteredStoreItems();
  const html = list
    .slice(0, 300)
    .map(({ store, item }, idx) => {
      const key = `${store.id}::${item.name_normalized || item.name}::${idx}`;
      const active = state.selectedStoreKey === key ? "active" : "";
      return `
        <article class="store-item ${active}" data-key="${esc(key)}" data-idx="${idx}">
          <div></div>
          <div>
            <h3>${esc(item.name)}</h3>
            <div class="meta-line">${esc(store.store_name)} · ${esc(item.category || "")}</div>
            <div class="badges">
              <span class="badge accent">${fmtKrw(item.price_krw)}</span>
              ${item.is_set ? `<span class="badge">세트</span>` : ""}
              ${item.is_store_exclusive ? `<span class="badge warn">매장전용</span>` : ""}
            </div>
          </div>
        </article>`;
    })
    .join("");
  const more =
    list.length > 300
      ? `<p class="placeholder" style="padding:12px">상위 300개만 표시</p>`
      : "";
  $("#store-list").innerHTML = html + more || `<p class="placeholder" style="padding:12px">결과 없음</p>`;

  $$("#store-list .store-item").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedStoreKey = el.dataset.key;
      const idx = Number(el.dataset.idx);
      renderStoreList();
      const entry = filteredStoreItems()[idx];
      if (entry) renderStoreDetailEntry(entry);
    });
  });
}

function renderStoreDetail(key) {
  const idx = filteredStoreItems().findIndex((_, i) => {
    const { store, item } = filteredStoreItems()[i];
    return `${store.id}::${item.name_normalized || item.name}::${i}` === key;
  });
  if (idx >= 0) renderStoreDetailEntry(filteredStoreItems()[idx]);
}

function renderStoreDetailEntry({ store, item }) {
  const linked = state.menus.find(
    (m) =>
      m.name_ko === item.base_menu_name ||
      m.name_ko === item.name ||
      m.name_ko.replace(/\s+/g, "") === (item.name_normalized || "").replace(/\s+/g, "")
  );

  $("#store-detail").innerHTML = `
  <h2>${esc(item.name)}</h2>
  <p class="meta-line">${esc(store.store_name)} · ${esc(item.category || "")}</p>
  <div class="badges" style="margin:10px 0">
    <span class="badge accent">${fmtKrw(item.price_krw)}</span>
    ${item.is_set ? `<span class="badge">세트</span>` : ""}
    ${item.is_store_exclusive ? `<span class="badge warn">매장전용</span>` : ""}
    ${(item.badges || []).map((b) => `<span class="badge">${esc(b)}</span>`).join("")}
  </div>
  ${item.image_url ? `<img src="${esc(item.image_url)}" alt="" style="max-width:200px;border-radius:12px;margin-bottom:12px" />` : ""}
  ${item.description ? `<p>${esc(item.description)}</p>` : ""}
  ${
    (item.set_components || []).length
      ? `<p class="meta-line"><strong>세트 구성</strong> ${esc(item.set_components.join(", "))}</p>`
      : ""
  }
  ${
    linked
      ? `<p style="margin-top:16px"><button type="button" class="chip" id="goto-official-menu">공식 메뉴 상세 보기 → ${esc(linked.name_ko)}</button></p>`
      : "<p class='meta-line' style='margin-top:16px'>연결된 공식 메뉴 없음</p>"
  }
  `;

  const btn = $("#goto-official-menu");
  if (btn && linked) {
    btn.addEventListener("click", () => {
      state.selectedMenuId = linked.id;
      $(`.nav-btn[data-view="menus"]`).click();
      renderMenuDetail(linked.id);
    });
  }
}

bootstrap();
