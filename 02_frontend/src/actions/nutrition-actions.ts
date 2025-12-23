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

export async function getNutritionHistory() {
  const today = startOfDay(new Date());
  // Letzte 7 Tage berechnen (exklusive heute oder inklusive? Meistens inklusive heute rückblickend)
  // Wir nehmen die letzten 7 Tage *vor* heute für die History, oder einfach die letzten 7 Einträge.
  // Besser: Einen expliziten Range abfragen.
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6); // Heute + 6 Tage zurück = 7 Tage range

  try {
    const history = await db.dailyNutrition.findMany({
      where: {
        date: {
          gte: sevenDaysAgo,
          lte: today,
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    return history;
  } catch (error) {
    console.error("Error fetching nutrition history:", error);
    return [];
  }
}
