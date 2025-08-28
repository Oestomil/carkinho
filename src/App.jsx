import React, { useEffect, useState } from "react";
import Wheel from "./components/Wheel.jsx";
import { PRESETS } from "./presets.js";
import confetti from "canvas-confetti";
import FlagSelect from "./components/FlagSelect.jsx";
import 'flag-icons/css/flag-icons.min.css';

const LS_KEYS = {
  ITEMS: "carkinho_items",
  DURATION: "carkinho_duration",
  REMOVE_WINNER: "carkinho_remove_winner",
};

// Tepenin işaret ettiği açıdan kazananı bul
function getWinnerIndexFromRotation(rotationDeg, count) {
  if (!count) return null;
  const seg = 360 / count;
  const topAngle = ((-rotationDeg % 360) + 360) % 360;
  return Math.floor((topAngle + seg / 2) / seg) % count;
}

export default function App() {
  const [rawInput, setRawInput] = useState("");
  const [items, setItems] = useState([]);
  const [duration, setDuration] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [winnerName, setWinnerName] = useState("");
  const [removeWinner, setRemoveWinner] = useState(false);

  const canSpin = items.length >= 2 && !isSpinning;

  // İlk yükleme: localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEYS.ITEMS);
    const savedDur = localStorage.getItem(LS_KEYS.DURATION);
    const savedRem = localStorage.getItem(LS_KEYS.REMOVE_WINNER);
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length) {
          setItems(arr);
          setRawInput(arr.join("\n"));
        }
      } catch {}
    }
    if (savedDur) setDuration(Number(savedDur) || 3);
    if (savedRem) setRemoveWinner(savedRem === "1");
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(LS_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.DURATION, String(duration));
  }, [duration]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.REMOVE_WINNER, removeWinner ? "1" : "0");
  }, [removeWinner]);

  // Kazanan çıktığında konfeti 🎉
  useEffect(() => {
    if (!winnerName) return;
    const shoot = (particleCount, spread, startVel, scalar) =>
      confetti({
        particleCount,
        spread,
        startVelocity: startVel,
        scalar,
        origin: { y: 0.2 },
      });
    shoot(90, 70, 45, 1);
    setTimeout(() => shoot(60, 110, 35, 0.9), 200);
    setTimeout(() => shoot(40, 80, 25, 1.1), 450);
  }, [winnerName]);

  const parseAndSet = () => {
    const list = rawInput
      .split(/\r?\n|,/g)
      .map((s) => s.trim())
      .filter(Boolean);
    const deduped = Array.from(new Set(list));
    setItems(deduped);
    setWinnerIndex(null);
    setWinnerName("");
  };

  const clearAll = () => {
    setRawInput("");
    setItems([]);
    setWinnerIndex(null);
    setWinnerName("");
  };

  const loadPreset = (key) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setRawInput(preset.join("\n"));
    setItems(preset);
    setWinnerIndex(null);
    setWinnerName("");
  };

  // Çevir: rastgele bir açıya götür; kazananı dönüş bitince açıdan hesapla
  const spin = () => {
    if (!canSpin) return;

    // Wheel'ı görünür alana kaydır
    const wheelElement = document.querySelector(".wheelBox");
    if (wheelElement) {
      wheelElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    setIsSpinning(true);
    const spins = 6; // tam tur sayısı
    const randomExtra = Math.random() * 360;
    const target = rotation + spins * 360 + randomExtra;

    setWinnerIndex(null);
    setWinnerName("");
    setRotation(target);
  };

  const onSpinEnd = () => {
    setIsSpinning(false);
    const idx = getWinnerIndexFromRotation(rotation, items.length);
    if (idx == null || items.length === 0) return;
    const name = items[idx];
    setWinnerIndex(idx);
    setWinnerName(name);

    if (removeWinner) {
      const next = items.filter((_, i) => i !== idx);
      setItems(next);
      setRawInput(next.join("\n"));
    }
  };

  const repeat = () => {
    setWinnerIndex(null);
    setWinnerName("");
    spin();
  };

  const exampleHint =
    items.length === 0
      ? "Örnek: Ali, Ayşe, Mehmet, Zeynep… (her satır veya virgülle)"
      : "";

  // ---- Bayraklı preset seçenekleri (SVG) ----
  const presetOptions = [
    // Premier League (GB)
    {
      value: "premier_2024_25_short",
      label: "PL 24–25 (kısa)",
      Flag: () => <span className="fi fi-gb-eng"></span>,
    },
    {
      value: "premier_2025_26_short",
      label: "PL 25–26 (kısa)",
      Flag: () => <span className="fi fi-gb-eng"></span>,
    },

    // Süper Lig (TR)
    {
      value: "superlig_2024_25_short",
      label: "Süper Lig 24–25",
      Flag: () => <span className="fi fi-tr"></span>,
    },
    {
      value: "superlig_2025_26_short",
      label: "Süper Lig 25–26",
      Flag: () => <span className="fi fi-tr"></span>,
    },

    // Bundesliga (DE)
    {
      value: "bundesliga_2024_25_short",
      label: "Bundesliga 24–25",
      Flag: () => <span className="fi fi-de"></span>,
    },
    {
      value: "bundesliga_2025_26_short",
      label: "Bundesliga 25–26",
      Flag: () => <span className="fi fi-de"></span>,
    },

    // LaLiga (ES)
    {
      value: "laliga_2024_25_short",
      label: "LaLiga 24–25",
      Flag: () => <span className="fi fi-es"></span>,
    },
    {
      value: "laliga_2025_26_short",
      label: "LaLiga 25–26",
      Flag: () => <span className="fi fi-es"></span>,
    },

    // Serie A (IT)
    {
      value: "seriea_2024_25_short",
      label: "Serie A 24–25",
      Flag: () => <span className="fi fi-it"></span>,
    },
    {
      value: "seriea_2025_26_short",
      label: "Serie A 25–26",
      Flag: () => <span className="fi fi-it"></span>,
    },

    // Diğer
    { value: "numbers1to10", label: "1–10 sayılar", Flag: null },
  ];

  return (
    <div className="wrap fancy-bg">
      <header className="topbar">
        <a href="https://carkinho.vercel.app" className="logo-link" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="logo-neon">Carkinho 🎡</h1>
          <div className="subtitle">Adil & Eğlenceli Çarkıfelek</div>
        </a>
      </header>

      <main className="grid">
        {/* Sol panel */}
        <section className="panel glass">
          <h2 className="h2">Liste</h2>
          <div className="presetRow">
            <label>Hazır listeler:</label>

            {/* BAYRAKLI ÖZEL MENÜ */}
            <FlagSelect
              options={presetOptions}
              placeholder="Liste seç…"
              onChange={(val) => loadPreset(val)}
            />

            <button className="ghost" onClick={clearAll}>
              Temizle
            </button>
          </div>

          <textarea
            className="names"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder={exampleHint}
            spellCheck={false}
          />

          <div className="row">
            <button className="btn-primary" onClick={parseAndSet}>
              Listeyi Uygula
            </button>
            <label className="inline">
              <input
                type="checkbox"
                checked={removeWinner}
                onChange={(e) => setRemoveWinner(e.target.checked)}
              />
              Kazananı listeden çıkar
            </label>
          </div>

          <h2 className="h2">Ayarlar</h2>
          <div className="row">
            <label className="block">
              Süre: <b>{duration.toFixed(1)} s</b>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
              />
            </label>
          </div>

          <div className="row">
            <button
              className="btn-cta"
              disabled={!canSpin}
              onClick={spin}
              data-bling={canSpin ? "1" : undefined}
            >
              Çevir
            </button>
            {winnerName && (
              <button className="secondary" onClick={repeat}>
                Tekrarla
              </button>
            )}
          </div>

          {items.length > 0 && (
            <div className="muted">
              {items.length} seçenek yüklü. En fazla ~30–40 dilim önerilir.
            </div>
          )}
        </section>

        {/* Sağ panel */}
        <section className="panel glass wheelPanel">
          <div className="wheelBox">
            <div className="pointer glow" />
            <Wheel
              items={items}
              rotation={rotation}
              duration={duration}
              isSpinning={isSpinning}
              onSpinEnd={onSpinEnd}
            />
          </div>

          <div className={`resultBox ${winnerName ? "pop" : ""}`}>
            {winnerName ? (
              <div className="winner">
                <div>Kazanan:</div>
                <strong>{winnerName}</strong>
              </div>
            ) : (
              <div className="muted">Kazanan burada görünecek</div>
            )}
          </div>
        </section>
      </main>

      {/* Mobil alt çubuk (≤768px görünür) */}
      <div className="mobile-cta">
        <button className="btn-cta" onClick={spin} disabled={!canSpin}>
          Çevir
        </button>
        {winnerName && (
          <button className="secondary" onClick={repeat}>
            Tekrarla
          </button>
        )}
      </div>

      <footer className="footer">
        <span>
          © {new Date().getFullYear()} Carkinho —{" "}
          <em>“şansın döndüğü yer”</em>
        </span>
      </footer>
    </div>
  );
}
