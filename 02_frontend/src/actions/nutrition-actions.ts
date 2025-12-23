"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { startOfDay } from "date-fns";

export async function getTodayNutrition() {
  const today = startOfDay(new Date());

  try {
    const entry = await db.dailyNutrition.findUnique({
      where: {
        date: today,
      },
    });

    if (!entry) {
      return {
        protein: false,
        vitamins: false,
        water: false,
        sweets: false,
        date: today,
      };
    }

    return entry;
  } catch (error) {
    console.error("Error fetching today nutrition:", error);
    return { protein: false, vitamins: false, water: false, sweets: false, date: today };
  }
}

export async function toggleNutritionHabit(habit: "protein" | "vitamins" | "water" | "sweets") {
  const today = startOfDay(new Date());

  try {
    const existing = await db.dailyNutrition.findUnique({
      where: { date: today }
    });

    if (existing) {
      const newValue = !existing[habit];
      await db.dailyNutrition.update({
        where: { id: existing.id },
        data: { [habit]: newValue }
      });
    } else {
      await db.dailyNutrition.create({
        data: {
          date: today,
          [habit]: true
        }
      });
    }

    revalidatePath("/ernaehrung");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling nutrition habit:", error);
    return { success: false, error };
  }
}
