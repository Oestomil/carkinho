// src/presets.js

// Önce basit listeler
export const numbers1to10 = Array.from({ length: 10 }, (_, i) => String(i + 1));

// ───────── Premier League ─────────
export const premier_2024_25_short = [
  "Arsenal","Aston Villa","Bmouth","Brentford","Brighton","Chelsea","Palace",
  "Everton","Fulham","Ipswich","Leicester","Liverpool","Man City","Man Utd",
  "Newcastle","Forest","Southampton","Spurs","West Ham","Wolves",
];

export const premier_2025_26_short = [
  "Arsenal","Aston Villa","Bmouth","Brentford","Brighton","Burnley","Chelsea",
  "Palace","Everton","Fulham","Leeds","Liverpool","Man City","Man Utd",
  "Newcastle","Forest","Spurs","West Ham","Wolves","Sunderland",
];

// ───────── LaLiga ─────────
export const laliga_2024_25_short = [
  "Barcelona","Real","Atlético","Athletic","Sociedad","Villarreal","Betis",
  "Sevilla","Valencia","Getafe","Osasuna","Celta","Alavés","Rayo","Mallorca",
  "Las Palmas","Espanyol","Leganés","Valladolid","Girona",
];

export const laliga_2025_26_short = [
  "Barcelona","Real","Atlético","Athletic","Sociedad","Villarreal","Betis",
  "Sevilla","Valencia","Getafe","Osasuna","Celta","Alavés","Rayo",
  "Mallorca","Elche","Girona","Levante","Oviedo","Las Palmas",
];

// ───────── Bundesliga ─────────
export const bundesliga_2024_25_short = [
  "Augsburg","Union","Bochum","Bremen","Dortmund","Frankfurt","Freiburg",
  "Heidenheim","Hoffenheim","Kiel","Leipzig","Leverkusen","Mainz","Gladbach",
  "Bayern","St. Pauli","Stuttgart","Wolfsburg",
];

export const bundesliga_2025_26_short = [
  "Bayern","Dortmund","Leverkusen","Leipzig","Frankfurt","Stuttgart",
  "Wolfsburg","Augsburg","Union","Mainz","Gladbach","Freiburg","Hoffenheim",
  "Bremen","Heidenheim","St. Pauli","Köln","Hamburg",
];

// ───────── Süper Lig ─────────
export const superlig_2024_25_short = [
  "GS","FB","BJK","Trabzon","Başakş.","Eyüp","Göztepe","Rize","Kasımpaşa",
  "Konya","Gaziantep","Alanya","Kayseri","Antalya","Samsun","Sivas","Hatay",
  "Adana DS","Bodrum",
];

export const superlig_2025_26_short = [
  "GS","FB","BJK","Trabzon","Başakş.","Eyüp","Göztepe","Rize","Kasımpaşa",
  "Konya","Gaziantep","Alanya","Kayseri","Antalya","Samsun",
  "Kocaelispor","Gençlerb.","Karagümrük",
];

// ───────── Serie A ─────────
export const seriea_2024_25_short = [
  "Atalanta","Bologna","Cagliari","Como","Empoli","Fiorentina","Genoa","Inter",
  "Juve","Lazio","Lecce","Milan","Monza","Napoli","Parma","Roma","Torino",
  "Udinese","Verona","Venezia",
];

export const seriea_2025_26_short = [
  "Atalanta","Bologna","Cagliari","Como","Cremonese","Fiorentina","Genoa",
  "Inter","Juve","Lazio","Lecce","Milan","Napoli","Parma","Roma","Sassuolo",
  "Torino","Udinese","Verona","Pisa",
];

// En sonda tek nesne export et: App.jsx bunu import ediyor
export const PRESETS = {
  numbers1to10,

  premier_2024_25_short,
  premier_2025_26_short,

  laliga_2024_25_short,
  laliga_2025_26_short,

  bundesliga_2024_25_short,
  bundesliga_2025_26_short,

  superlig_2024_25_short,
  superlig_2025_26_short,

  seriea_2024_25_short,
  seriea_2025_26_short,
};
