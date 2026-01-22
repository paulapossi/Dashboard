"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/error-logger";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { cache } from "react";

export const getWeeklyReading = cache(async function getWeeklyReading() {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);

  try {
    const entry = await db.weeklyReading.findUnique({
      where: {
        weekNumber_year: {
          weekNumber,
          year,
        },
      },
    });

    if (!entry) {
      return {
        day1: false, day2: false, day3: false, day4: false, day5: false, day6: false, day7: false,
        weekNumber,
        year
      };
    }

    return entry;
  } catch (error) {
    console.error("Error fetching weekly reading:", error);
    return { day1: false, day2: false, day3: false, day4: false, day5: false, day6: false, day7: false, weekNumber, year };
  }
});

export async function toggleReadingDay(dayKey: string) {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);

  try {
    const existing = await db.weeklyReading.findUnique({
      where: { weekNumber_year: { weekNumber, year } }
    });

    if (existing) {
      const newValue = !((existing as any)[dayKey]);
      await db.weeklyReading.update({
        where: { id: existing.id },
        data: { [dayKey]: newValue }
      });
    } else {
      await db.weeklyReading.create({
        data: {
          weekNumber,
          year,
          [dayKey]: true
        }
      });
    }

    revalidatePath("/lesen");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling reading day:", error);
    return { success: false, error };
  }
}

export async function undoReadingDay() {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);

  try {
    const existing = await db.weeklyReading.findUnique({
      where: { weekNumber_year: { weekNumber, year } }
    });

    if (!existing) return { success: false };

    // Reverse order: day7 -> day1
    const keys = ['day7', 'day6', 'day5', 'day4', 'day3', 'day2', 'day1'];
    
    for (const key of keys) {
        // @ts-ignore
        if (existing[key] === true) {
            await db.weeklyReading.update({
                where: { id: existing.id },
                data: { [key]: false }
            });
            revalidatePath("/lesen");
            revalidatePath("/");
            return { success: true };
        }
    }
    return { success: false };
  } catch (error) {
      return { success: false, error };
  }
}
