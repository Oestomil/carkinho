import React, { useEffect, useState } from "react";
import Wheel from "./components/Wheel.jsx";
import { PRESETS } from "./presets.js";

const LS_KEYS = {
  ITEMS: "carkinho_items",
  DURATION: "carkinho_duration",
  REMOVE_WINNER: "carkinho_remove_winner",
};

// 0° tepe – çark saat yönünde rotation kadar döner.
// Tepenin işaret ettiği "orijinal açı" = (-rotation) mod 360
function getWinnerIndexFromRotation(rotationDeg, count) {
  if (!count) return null;
  const seg = 360 / count;
  const topAngle = ((-rotationDeg % 360) + 360) % 360; // [0,360)
  return Math.floor((topAngle + seg / 2) / seg) % count;
}

export default function App() {
  const [rawInput, setRawInput] = useState("");
  const [items, setItems] = useState([]);
  const [duration, setDuration] = useState(3); // saniye
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [winnerName, setWinnerName] = useState("");
  const [removeWinner, setRemoveWinner] = useState(false);

  const canSpin = items.length >= 2 && !isSpinning;

  // ── İlk yüklemede localStorage'dan oku
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

  // ── Kaydet
  useEffect(() => {
    localStorage.setItem(LS_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.DURATION, String(duration));
  }, [duration]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.REMOVE_WINNER, removeWinner ? "1" : "0");
  }, [removeWinner]);

  // ── Metni listeye çevir
  const parseAndSet = () => {
    const list = rawInput
      .split(/\r?\n|,/g)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
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

  // ── Preset yükle
  const loadPreset = (key) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setRawInput(preset.join("\n"));
    setItems(preset);
    setWinnerIndex(null);
    setWinnerName("");
  };

  // ── Çevir: rastgele bir açıya götür; kazanan dönüş bitince açıdan hesaplanacak
  const spin = () => {
    if (!canSpin) return;
    setIsSpinning(true);

    const spins = 6; // tam tur sayısı
    const randomExtra = Math.random() * 360; // 0–360
    const target = rotation + spins * 360 + randomExtra;

    setWinnerIndex(null);
    setWinnerName("");
    setRotation(target);
  };

  // ── Dönüş bitince tepedeki dilimi bul
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

  return (
    <div className="wrap">
      <header className="topbar">
        <h1>Carkinho 🎡</h1>
        <div className="subtitle">Adil & Eğlenceli Çarkıfelek</div>
      </header>

      <main className="grid">
        {/* Sol panel: liste ve ayarlar */}
        <section className="panel">
          <h2>Liste</h2>
          <div className="presetRow">
            <label>Hazır listeler:</label>
            <select
              onChange={(e) => {
                if (e.target.value) loadPreset(e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Liste seç…
              </option>

              {/* Premier League */}
              <option value="premier_2024_25_short">
                Premier League 24–25 (kısa)
              </option>
              <option value="premier_2025_26_short">
                Premier League 25–26 (kısa)
              </option>

              {/* Süper Lig */}
              <option value="superlig_2024_25_short">
                Süper Lig 24–25 (kısa)
              </option>
              <option value="superlig_2025_26_short">
                Süper Lig 25–26 (kısa)
              </option>

              {/* Bundesliga */}
              <option value="bundesliga_2024_25_short">
                Bundesliga 24–25 (kısa)
              </option>
              <option value="bundesliga_2025_26_short">
                Bundesliga 25–26 (kısa)
              </option>

              {/* LaLiga */}
              <option value="laliga_2024_25_short">
                LaLiga 24–25 (kısa)
              </option>
              <option value="laliga_2025_26_short">
                LaLiga 25–26 (kısa)
              </option>

              {/* Serie A */}
              <option value="seriea_2024_25_short">
                Serie A 24–25 (kısa)
              </option>
              <option value="seriea_2025_26_short">
                Serie A 25–26 (kısa)
              </option>

              {/* Basit örnek */}
              <option value="numbers1to10">1–10 sayılar</option>
            </select>
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
            <button onClick={parseAndSet}>Listeyi Uygula</button>
            <label className="inline">
              <input
                type="checkbox"
                checked={removeWinner}
                onChange={(e) => setRemoveWinner(e.target.checked)}
              />
              Kazananı listeden çıkar
            </label>
          </div>

          <h2>Ayarlar</h2>
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
            <button disabled={!canSpin} onClick={spin}>
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

        {/* Sağ panel: çark */}
        <section className="panel wheelPanel">
          <div className="wheelBox">
            <div className="pointer" />
            <Wheel
              items={items}
              rotation={rotation}
              duration={duration}
              isSpinning={isSpinning}
              onSpinEnd={onSpinEnd}
            />
          </div>

          <div className="resultBox">
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

      <footer className="footer">
        <span>
          © {new Date().getFullYear()} Carkinho —{" "}
          <em>“şansın döndüğü yer”</em>
        </span>
      </footer>
    </div>
  );
}
