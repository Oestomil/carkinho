import React, { useMemo, useRef, useEffect } from "react";

// derece→radyan
const deg2rad = (deg) => (deg * Math.PI) / 180;

// 0° = tepe (12 yönü), saat yönü+
function polarFromTop(cx, cy, r, deg) {
  const rad = deg2rad(deg - 90);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Dilim (wedge) path'i
function wedgePath(cx, cy, r, startDeg, endDeg) {
  const p0 = polarFromTop(cx, cy, r, startDeg);
  const p1 = polarFromTop(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
}

// Etiket konumu (dilim merkez açısında)
function labelPos(cx, cy, r, centerDeg) {
  return polarFromTop(cx, cy, r, centerDeg);
}

export default function Wheel({
  items,
  rotation,
  duration = 3,
  isSpinning,
  onSpinEnd,
}) {
  const size = 480;        // SVG boyutu (px)
  const r = size / 2 - 8;  // dış yarıçap
  const cx = size / 2;
  const cy = size / 2;

  const seg = items.length ? 360 / items.length : 0;

  const slices = useMemo(() => {
    return items.map((label, i) => {
      const start = i * seg - seg / 2;
      const end = start + seg;
      const center = i * seg;
      const hue = Math.floor((i / Math.max(1, items.length)) * 360);
      const fill = `hsl(${hue} 70% 45%)`;
      return { label, start, end, center, fill, i };
    });
  }, [items, seg]);

  const wheelRef = useRef(null);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const handler = () => onSpinEnd && onSpinEnd();
    el.addEventListener("transitionend", handler);
    return () => el.removeEventListener("transitionend", handler);
  }, [onSpinEnd]);

  const style = {
    transform: `rotate(${rotation}deg)`,
    transition: isSpinning
      ? `transform ${duration}s cubic-bezier(.2,.9,.1,1)`
      : "none",
  };

  // Etiket ayarları
  const LABEL_RADIUS_FACTOR = 0.52; // 0.50–0.55 arası güvenli, dışarı taşmaz
  const MAX_LABEL_LEN = 14;
  const FONT_SIZE = 13;

  return (
    <div className="wheel" ref={wheelRef} style={style}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          {/* Dış halka */}
          <circle cx={cx} cy={cy} r={r + 6} fill="#111827" />
          <circle cx={cx} cy={cy} r={r + 4} fill="#2a2f45" />

          {/* Dilimler */}
          {slices.map((s) => (
            <path key={s.i} d={wedgePath(cx, cy, r, s.start, s.end)} fill={s.fill} />
          ))}

          {/* Etiketler: dikey, kalın, sıkı; taşma yok */}
          {slices.map((s) => {
            const p = labelPos(cx, cy, r * LABEL_RADIUS_FACTOR, s.center);
            const label =
              s.label.length > MAX_LABEL_LEN
                ? s.label.slice(0, MAX_LABEL_LEN) + "…"
                : s.label;

            return (
              <text
                key={`t-${s.i}`}
                x={p.x}
                y={p.y}
                fontSize={FONT_SIZE}
                fontWeight="700"
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${s.center}, ${p.x}, ${p.y})`}
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "upright",
                  letterSpacing: "-1px", // harfleri sıkılaştır
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {label}
              </text>
            );
          })}

          {/* Orta kapak */}
          <circle cx={cx} cy={cy} r={36} fill="#0ea5e9" stroke="#93c5fd" strokeWidth="3" />
          <text
            x={cx}
            y={cy}
            fill="#06283b"
            fontWeight="800"
            fontSize="13"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            CARKINHO
          </text>
        </g>
      </svg>
    </div>
  );
}
