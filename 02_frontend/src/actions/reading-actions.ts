"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getISOWeek, getYear } from "date-fns";

export async function getWeeklyReading() {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getYear(now);

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
}

export async function toggleReadingDay(dayKey: string) {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getYear(now);

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
