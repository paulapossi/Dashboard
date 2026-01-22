// Common Types for Life-OS Dashboard

export type SportData = {
  gym1: boolean;
  gym2: boolean;
  run1: boolean;
  run2: boolean;
};

export type ReadingData = {
  day1: boolean;
  day2: boolean;
  day3: boolean;
  day4: boolean;
  day5: boolean;
  day6: boolean;
  day7: boolean;
};

export type NutritionData = {
  protein: boolean;
  vitamins: boolean;
  water: boolean;
  sweets: boolean;
};

export type RelationshipData = {
  isTogether: boolean;
  daysTogether: number;
  weeklyGoal: number;
};

export type MentalData = {
  meTimeHours: number;
  weeklyGoal: number;
};

export type UniData = {
  sessions: number;
  weeklyGoal: number;
};

export type Category = {
  id: string;
  label: string;
  progress: number;
  color: string;
  shape?: string;
};

export type ColorTheme = {
  start: string;
  mid: string;
  end: string;
};
