"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/error-logger";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { cache } from "react";

// --- GETTERS ---

export const getMentalData = cache(async function getMentalData() {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);

  try {
    // 1. Weekly Me Time
    const meTimeEntry = await db.weeklyMental.findUnique({
      where: { weekNumber_year: { weekNumber, year } }
    });

    // 2. Journal Entries (Neueste zuerst)
    const journalEntries = await db.journalEntry.findMany({
      orderBy: { createdAt: "desc" }
    });

    // 3. Brain Dump (Nur unverarbeitete, Neueste zuerst)
    const brainDumpItems = await db.brainDumpItem.findMany({
      where: { isProcessed: false },
      orderBy: { createdAt: "desc" }
    });

    return {
      meTimeHours: meTimeEntry?.meTimeHours || 0,
      journalEntries,
      brainDumpItems,
      weekNumber,
      year
    };

  } catch (error) {
    console.error("Error fetching mental data:", error);
    return {
      meTimeHours: 0,
      journalEntries: [],
      brainDumpItems: [],
      weekNumber,
      year
    };
  }
});

// --- ACTIONS: Me Time ---

export async function updateMeTime(delta: number) {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);

  try {
    const existing = await db.weeklyMental.findUnique({
      where: { weekNumber_year: { weekNumber, year } }
    });

    let newHours = 0;

    if (existing) {
      // Sicherstellen, dass wir nicht unter 0 gehen
      newHours = Math.max(0, existing.meTimeHours + delta);
      await db.weeklyMental.update({
        where: { id: existing.id },
        data: { meTimeHours: newHours }
      });
    } else {
      newHours = Math.max(0, delta); // Startwert falls nicht existent
      await db.weeklyMental.create({
        data: {
          weekNumber,
          year,
          meTimeHours: newHours
        }
      });
    }

    revalidatePath("/mental");
    revalidatePath("/"); // Auch Dashboard updaten
    return { success: true, newHours };

  } catch (error) {
    console.error("Error updating me time:", error);
    return { success: false, error };
  }
}

export async function decreaseMeTime() {
    return await updateMeTime(-1);
}

// --- ACTIONS: Journal ---

export async function addJournalEntry(formData: FormData) {
  const content = formData.get("content") as string;
  const mood = formData.get("mood") as string;

  if (!content) return { success: false };

  try {
    await db.journalEntry.create({
      data: {
        content,
        mood: mood || "Neutral"
      }
    });
    revalidatePath("/mental");
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteJournalEntry(id: string) {
  try {
    await db.journalEntry.delete({ where: { id } });
    revalidatePath("/mental");
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

// --- ACTIONS: Brain Dump ---

export async function addBrainDumpItem(formData: FormData) {
    // Falls Aufruf direkt mit String (für Client Comp) oder FormData
    let content = "";
    if (formData instanceof FormData) {
        content = formData.get("text") as string;
    } else {
        // Fallback falls man es anders aufruft, aber Server Actions erwarten meist FormData oder simple Types
        // Wir machen hier eine Weiche oder erwarten FormData
    }

    // ACHTUNG: Wir erlauben auch direkten Aufruf mit String für flexiblere Nutzung im Dashboard
    // Aber Server Actions müssen serialisierbar sein.
}

// Besser: Zwei Funktionen oder einfache Signatur
export async function createBrainDump(text: string) {
  if (!text.trim()) return { success: false };

  try {
    await db.brainDumpItem.create({
      data: { content: text }
    });
    revalidatePath("/mental");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function processBrainDumpItem(id: string) {
  try {
    // Wir löschen es nicht physisch, sondern markieren es als "processed" (Archiv)
    // Oder wir löschen es ganz? Der User Button hieß "Trash".
    // "Verarbeitet" klingt nach soft-delete. Ich mache soft-delete (isProcessed=true).
    await db.brainDumpItem.update({
        where: { id },
        data: { isProcessed: true }
    });
    revalidatePath("/mental");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
