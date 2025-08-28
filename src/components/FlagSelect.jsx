import React, { useEffect, useRef, useState } from "react";

/**
 * Props:
 * - options: { value: string, label: string, Flag: React.FC }[]
 * - placeholder: string
 * - onChange: (value: string) => void
 */
export default function FlagSelect({ options, placeholder, onChange }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (opt) => {
    setSelected(opt);
    setOpen(false);
    onChange?.(opt.value);
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") setHighlight((h) => Math.min(h + 1, options.length - 1));
    if (e.key === "ArrowUp") setHighlight((h) => Math.max(h - 1, 0));
    if (e.key === "Enter") pick(options[highlight]);
  };

  return (
    <div className="flagselect" ref={ref}>
      <button
        type="button"
        className="flagselect-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        {selected?.Flag ? <selected.Flag className="flag-ico" /> : null}
        <span>{selected ? selected.label : (placeholder || "Liste seç…")}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" className={`chev ${open ? "up" : ""}`}>
          <path fill="currentColor" d="M7 10l5 5 5-5z"/>
        </svg>
      </button>

      {open && (
        <ul className="flagselect-list" role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={selected?.value === opt.value}
              className={`flagselect-item ${i === highlight ? "hl" : ""}`}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => pick(opt)}
            >
              {opt.Flag ? <opt.Flag className="flag-ico" /> : null}
              <span>{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
