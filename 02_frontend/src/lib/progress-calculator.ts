// Progress Calculation Utilities
// Centralized logic for all dashboard progress calculations

import type { SportData, ReadingData, NutritionData, RelationshipData, MentalData, UniData } from "@/types";
import { WEEKLY_GOALS } from "./constants";

/**
 * Calculate sport progress percentage
 * Based on completed workouts out of 4 weekly sessions
 */
export function calculateSportProgress(data?: SportData): number {
  if (!data) return 0;
  const completed = Object.values(data).filter(Boolean).length;
  return Math.round((completed / WEEKLY_GOALS.SPORT_SESSIONS) * 100);
}

/**
 * Calculate reading progress percentage
 * Based on days read out of 7 weekly days
 */
export function calculateReadingProgress(data?: ReadingData): number {
  if (!data) return 0;
  const completed = Object.values(data).filter(Boolean).length;
  return Math.round((completed / WEEKLY_GOALS.READING_DAYS) * 100);
}

/**
 * Calculate nutrition progress percentage
 * Based on completed habits out of 4 daily habits
 */
export function calculateNutritionProgress(data?: NutritionData): number {
  if (!data) return 0;
  const completed = Object.values(data).filter(Boolean).length;
  return Math.round((completed / WEEKLY_GOALS.NUTRITION_HABITS) * 100);
}

/**
 * Calculate relationship progress percentage
 * Based on days together vs weekly goal
 */
export function calculateRelationshipProgress(data?: RelationshipData): number {
  if (!data) return 0;
  return Math.min(100, Math.round((data.daysTogether / data.weeklyGoal) * 100));
}

/**
 * Calculate mental health progress percentage
 * Based on me-time hours vs weekly goal
 */
export function calculateMentalProgress(data?: MentalData): number {
  if (!data) return 0;
  return Math.min(100, Math.round((data.meTimeHours / data.weeklyGoal) * 100));
}

/**
 * Calculate uni progress percentage
 * Based on deep work sessions vs weekly goal
 */
export function calculateUniProgress(data?: UniData): number {
  if (!data) return 0;
  return Math.min(100, Math.round((data.sessions / data.weeklyGoal) * 100));
}

/**
 * Get completion count for boolean-based data (Sport, Reading, Nutrition)
 */
export function getCompletedCount<T extends Record<string, boolean>>(data: T): number {
  return Object.values(data).filter(Boolean).length;
}

/**
 * Calculate overall dashboard completion
 * Average of all 6 categories
 */
export function calculateOverallProgress(
  sport?: SportData,
  reading?: ReadingData,
  nutrition?: NutritionData,
  relationship?: RelationshipData,
  mental?: MentalData,
  uni?: UniData
): number {
  const progresses = [
    calculateSportProgress(sport),
    calculateReadingProgress(reading),
    calculateNutritionProgress(nutrition),
    calculateRelationshipProgress(relationship),
    calculateMentalProgress(mental),
    calculateUniProgress(uni),
  ];
  
  const sum = progresses.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / progresses.length);
}
