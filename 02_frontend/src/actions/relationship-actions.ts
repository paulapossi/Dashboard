'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay, startOfWeek, getISOWeek, getYear } from "date-fns";
import { cache } from "react";

export const getTodayRelationship = cache(async function getTodayRelationship() {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  try {
    const entry = await db.relationshipDaily.findFirst({
      where: { 
          date: {
              gte: todayStart,
              lte: todayEnd
          }
      },
    });

    if (!entry) {
      return {
        isTogether: false,
        qualityTime: false,
        communication: false,
        gratitude: "",
        date: todayStart,
      };
    }

    return entry;
  } catch (error) {
    console.error("Error fetching today relationship:", error);
    return { isTogether: false, qualityTime: false, communication: false, gratitude: "", date: todayStart };
  }
});

export async function toggleTogether() {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  try {
    const existing = await db.relationshipDaily.findFirst({
      where: { 
          date: {
              gte: todayStart,
              lte: todayEnd
          }
       }
    });

    if (existing) {
      await db.relationshipDaily.update({
        where: { id: existing.id },
        data: { isTogether: !existing.isTogether }
      });
    }
    else {
      await db.relationshipDaily.create({
        data: {
          date: todayStart,
          isTogether: true
        }
      });
    }

    revalidatePath("/paula");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling together:", error);
    return { success: false, error };
  }
}

export async function saveCheckIn(data: { qualityTime: boolean; communication: boolean; gratitude: string }) {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  try {
    const existing = await db.relationshipDaily.findFirst({
      where: { 
          date: {
              gte: todayStart,
              lte: todayEnd
          }
       }
    });

    if (existing) {
      await db.relationshipDaily.update({
        where: { id: existing.id },
        data: { 
          qualityTime: data.qualityTime, 
          communication: data.communication, 
          gratitude: data.gratitude,
          isTogether: true // If checking in, usually together
        }
      });
    }
    else {
      await db.relationshipDaily.create({
        data: {
          date: todayStart,
          isTogether: true,
          qualityTime: data.qualityTime,
          communication: data.communication,
          gratitude: data.gratitude
        }
      });
    }

    revalidatePath("/paula");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error saving check-in:", error);
    return { success: false, error };
  }
}

export async function getRelationshipHistory(limit = 7) {
  try {
    const history = await db.relationshipDaily.findMany({
      orderBy: { date: 'desc' },
      take: limit
    });
    return history;
  } catch (error) {
    console.error("Error fetching relationship history:", error);
    return [];
  }
}

export async function getWeeklyStats() {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    
    try {
        const entries = await db.relationshipDaily.findMany({
            where: {
                date: { gte: weekStart }
            }
        });
        
        const daysTogether = entries.filter(e => e.isTogether).length;
        return {
            daysTogether,
            weeklyGoal: 4
        };
    } catch (error) {
        return { daysTogether: 0, weeklyGoal: 4 };
    }
}

export async function decreaseDaysTogether() {
    // Logic: Find the most recent "isTogether" entry in this week and set it to false?
    // Or just toggle TODAY to false if it is true?
    // "Toggle" action already exists. But maybe we specifically want to REMOVE a day.
    // Simplest: If TODAY is true, set to false. If today is false, we can't easily "remove" a past day without more complex UI.
    // Let's assume the user made a mistake TODAY.
    
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    try {
        const existing = await db.relationshipDaily.findFirst({
            where: { 
                date: {
                    gte: todayStart,
                    lte: todayEnd
                }
             }
        });
        
        if (existing && existing.isTogether) {
             await db.relationshipDaily.update({
                where: { id: existing.id },
                data: { isTogether: false }
            });
            revalidatePath("/paula");
            revalidatePath("/");
            return { success: true };
        }
        return { success: false, reason: "Not together today" };
    } catch (error) {
        return { success: false, error };
    }
}
