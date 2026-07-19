// Kiosk/AllergyAccordion — Figma 펼침: 230:16445
// Lime 강조 없음. 접힘/펼침만 로컬 상태.
import { useState } from "react";

const DEFAULT_TAGS = ["우유", "대두"];

export default function AllergenAccordion({
  allergens = DEFAULT_TAGS,
  title = "알레르기 정보",
  notice = "이 메뉴에 다음 알레르기 유발 성분이 포함되어 있습니다.",
  defaultOpen = false,
}) {
  const tags = Array.isArray(allergens) ? allergens.filter(Boolean) : [];
  const [open, setOpen] = useState(defaultOpen);

  if (tags.length === 0) return null;

  return (
    <section className={`allergen-accordion${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="allergen-accordion__header"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="allergen-accordion__icon" aria-hidden="true" />
        <span className="allergen-accordion__title">{title}</span>
        <strong className="allergen-accordion__count">{tags.length}</strong>
        <span className="allergen-accordion__chevron" aria-hidden="true" />
      </button>

      {open ? (
        <div className="allergen-accordion__body">
          <p>{notice}</p>
          <ul className="allergen-accordion__tags">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
