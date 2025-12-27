"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay } from "date-fns";

export async function getTodayNutrition() {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  try {
    const entry = await db.dailyNutrition.findFirst({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd
        },
      },
    });

    if (!entry) {
      return {
        protein: false,
        vitamins: false,
        water: false,
        sweets: false,
        date: todayStart,
      };
    }

    return entry;
  } catch (error) {
    console.error("Error fetching today nutrition:", error);
    return { protein: false, vitamins: false, water: false, sweets: false, date: todayStart };
  }
}

export async function toggleNutritionHabit(habit: "protein" | "vitamins" | "water" | "sweets") {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  try {
    const existing = await db.dailyNutrition.findFirst({
      where: {
         date: {
            gte: todayStart,
            lte: todayEnd
         }
      }
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
          date: todayStart, // Force normalized Midnight
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

export async function undoNutritionHabit() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    try {
        const existing = await db.dailyNutrition.findFirst({
            where: { 
                date: {
                    gte: todayStart,
                    lte: todayEnd
                }
            }
        });

        if (!existing) return { success: false };

        // Reverse order
        const keys = ['sweets', 'water', 'vitamins', 'protein'];
        
        for (const key of keys) {
            // @ts-ignore
            if (existing[key] === true) {
                await db.dailyNutrition.update({
                    where: { id: existing.id },
                    data: { [key]: false }
                });
                revalidatePath("/ernaehrung");
                revalidatePath("/");
                return { success: true };
            }
        }
        return { success: false };
    } catch (error) {
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
