import React, { useMemo, useRef, useEffect } from "react";

const deg2rad = (deg) => (deg * Math.PI) / 180;

// 0° = tepe (12 yönü), saat yönü+
function polarFromTop(cx, cy, r, deg) {
  const rad = deg2rad(deg - 90);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(cx, cy, r, startDeg, endDeg) {
  const p0 = polarFromTop(cx, cy, r, startDeg);
  const p1 = polarFromTop(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
}

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
  const size = 520;        // Daha iri görünüm
  const r = size / 2 - 10; // dış yarıçap
  const cx = size / 2;
  const cy = size / 2;

  const seg = items.length ? 360 / items.length : 0;

  const slices = useMemo(() => {
    return items.map((label, i) => {
      const start = i * seg - seg / 2;
      const end = start + seg;
      const center = i * seg;

      // iki tonlu gradient: h ve h+18
      const hue = Math.floor((i / Math.max(1, items.length)) * 360);
      const fillId = `g-${i}`;
      return { label, start, end, center, hue, fillId, i };
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
      ? `transform ${duration}s cubic-bezier(.15,.9,.1,1.05)` // hafif bounce-out
      : "none",
  };

  // Etiket ayarları
  const LABEL_RADIUS_FACTOR = 0.52; // 0.50–0.55 güvenli
  const MAX_LABEL_LEN = 14;
  const FONT_SIZE = 13;

  return (
    <div className="wheel neon-shadow" ref={wheelRef} style={style}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Dilimler için dinamik gradientler */}
          {slices.map((s) => (
            <linearGradient
              key={s.fillId}
              id={s.fillId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={`hsl(${s.hue} 80% 55%)`} />
              <stop offset="100%" stopColor={`hsl(${(s.hue + 18) % 360} 70% 40%)`} />
            </linearGradient>
          ))}
          {/* Hafif iç gölge */}
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          {/* Dış ringler */}
          <circle cx={cx} cy={cy} r={r + 8} fill="rgba(255,255,255,0.04)" />
          <circle cx={cx} cy={cy} r={r + 4} fill="#1f2338" />

          {/* Dilimler */}
          {slices.map((s) => (
            <path
              key={s.i}
              d={wedgePath(cx, cy, r, s.start, s.end)}
              fill={`url(#${s.fillId})`}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}

          {/* Etiketler: dikey, kalın, sıkı */}
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
                  letterSpacing: "-1px",
                  pointerEvents: "none",
                  userSelect: "none",
                  filter: "drop-shadow(0 1px 1px rgba(0,0,0,.5))",
                }}
              >
                {label}
              </text>
            );
          })}

          {/* Orta kapak */}
          <circle cx={cx} cy={cy} r={40} fill="#0ea5e9" stroke="#93c5fd" strokeWidth="3" />
          <g transform={`rotate(${-rotation} ${cx} ${cy})`}>
            <text
              x={cx}
              y={cy}
              fill="#06283b"
              fontWeight="800"
              fontSize="14"
              textAnchor="middle"
              dominantBaseline="middle"
              className="logo-center"
            >
              CARKINHO
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
