// Weekly Goals
export const WEEKLY_GOALS = {
  SPORT_SESSIONS: 4,
  READING_DAYS: 7,
  NUTRITION_HABITS: 4,
  RELATIONSHIP_DAYS: 5,
  MENTAL_ME_TIME_HOURS: 5,
  UNI_SESSIONS: 5,
} as const;

// Color Themes
export const COLOR_THEMES = {
  indigo: { start: "#312e81", mid: "#6366f1", end: "#a5b4fc" },
  teal: { start: "#134e4a", mid: "#14b8a6", end: "#5eead4" },
  yellow: { start: "#713f12", mid: "#eab308", end: "#fde047" },
  green: { start: "#064e3b", mid: "#10b981", end: "#6ee7b7" },
  red: { start: "#881337", mid: "#ef4444", end: "#fca5a5" },
  purple: { start: "#4c1d95", mid: "#8b5cf6", end: "#c4b5fd" },
  blue: { start: "#1e40af", mid: "#3b82f6", end: "#93c5fd" },
} as const;

// Bottle Shapes (SVG Paths)
export const BOTTLE_SHAPES = {
  potion: "M50,10 C60,10 65,25 65,35 C85,45 95,75 95,105 C95,135 75,155 50,155 C25,155 5,135 5,105 C5,75 15,45 35,35 C35,25 40,10 50,10 Z",
  diamond: "M50,5 L85,35 L95,85 L50,155 L5,85 L15,35 Z",
  square: "M20,10 C25,5 75,5 80,10 L90,30 C92,35 92,130 90,135 L80,155 C75,160 25,160 20,155 L10,135 C8,130 8,35 10,30 Z",
  leaf: "M50,5 C50,5 95,45 95,100 C95,140 75,160 50,160 C25,160 5,140 5,100 C5,45 50,5 50,5 Z",
  heart: "M50,35 C65,10 100,20 100,65 C100,110 50,160 50,160 C50,160 0,110 0,65 C0,20 35,10 50,35 Z",
  cloud: "M30,20 C40,10 60,10 70,20 C85,15 100,30 100,50 C100,65 90,75 80,80 C90,90 95,110 85,125 C75,140 55,140 45,130 C35,145 15,140 5,125 C-5,110 0,90 10,80 C0,75 -5,55 5,40 C15,25 25,25 30,20 Z",
} as const;

// Category Configuration
export const CATEGORIES = [
  { id: "uni", label: "Uni", color: "indigo" as const, shape: "potion" as const },
  { id: "sport", label: "Sport", color: "teal" as const, shape: "diamond" as const },
  { id: "lesen", label: "Lesen", color: "yellow" as const, shape: "square" as const },
  { id: "food", label: "Ernährung", color: "green" as const, shape: "leaf" as const },
  { id: "paula", label: "Paula", color: "red" as const, shape: "heart" as const },
  { id: "mental", label: "Mental", color: "purple" as const, shape: "cloud" as const },
] as const;
