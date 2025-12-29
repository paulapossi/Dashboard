"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getISOWeek, getISOWeekYear } from "date-fns";

/**
 * Holt den Sport-Eintrag für die aktuelle Woche.
 * Falls keiner existiert, wird (noch) nichts erstellt, sondern null zurückgegeben,
 * oder wir erstellen ihn lazy beim ersten Toggle. Hier erstellen wir ihn lazy beim Lesen, 
 * oder geben Default-Werte zurück.
 * 
 * Strategie: Wir geben das Objekt zurück. Wenn null, muss das Frontend wissen, alles ist false.
 */
export async function getWeeklySport() {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);

  try {
    const entry = await db.weeklySport.findUnique({
      where: {
        weekNumber_year: {
          weekNumber,
          year,
        },
      },
    });

    if (!entry) {
        // Default-Werte zurückgeben (nicht in DB schreiben, erst bei Aktion)
        return {
            gym1: false,
            gym2: false,
            run1: false,
            run2: false,
            weekNumber,
            year
        };
    }

    return entry;
  } catch (error) {
    console.error("Error fetching weekly sport:", error);
    return { gym1: false, gym2: false, run1: false, run2: false, weekNumber, year };
  }
}

/**
 * Schaltet eine Sport-Einheit um (true/false).
 * Erstellt den Eintrag, falls er für diese Woche noch nicht existiert.
 */
export async function toggleSportUnit(unit: "gym1" | "gym2" | "run1" | "run2") {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);

  try {
    // 1. Eintrag suchen oder erstellen
    const entry = await db.weeklySport.upsert({
      where: {
        weekNumber_year: {
          weekNumber,
          year,
        },
      },
      create: {
        weekNumber,
        year,
        [unit]: true, // Beim Erstellen direkt auf true setzen
      },
      update: {}, // Erstmal nichts updaten, wir brauchen den aktuellen Wert
    });

    // 2. Wert toggeln (da upsert create/update macht, müssen wir den aktuellen Wert prüfen)
    // Wenn wir gerade erstellt haben, ist es true. Wenn es schon existierte, müssen wir es toggeln.
    // Aber: upsert gibt den Datensatz zurück NACHDEM create oder update lief. 
    // Trick: Wir lesen erst, dann update/create. Upsert ist hier etwas tricky für Toggle.
    
    // Besserer Ansatz für Toggle:
    // Wir holen den aktuellen Record.
    const existing = await db.weeklySport.findUnique({
        where: { weekNumber_year: { weekNumber, year } }
    });

    let newValue = true;

    if (existing) {
        // Toggle
        newValue = !existing[unit];
        await db.weeklySport.update({
            where: { id: existing.id },
            data: { [unit]: newValue }
        });
    } else {
        // Erstellen mit Wert = true
        await db.weeklySport.create({
            data: {
                weekNumber,
                year,
                [unit]: true
            }
        });
    }

    revalidatePath("/sport");
    revalidatePath("/"); // Dashboard auch aktualisieren
    return { success: true };

  } catch (error) {
    console.error("Error toggling sport unit:", error);
    return { success: false, error };
  }
}

// Undo specific unit (set to false)
export async function undoSportUnit() {
    const now = new Date();
    const weekNumber = getISOWeek(now);
    const year = getISOWeekYear(now);

    // Logic: Find the LAST completed unit (run or gym) and toggle it off?
    // Or do we need specific undo buttons? The user asked for a "small minus".
    // For boolean flags (Sport, Reading, Nutrition), "minus" usually means "uncheck the last one added".
    // Since we fill them in order (Gym1 -> Gym2...), we should find the last true one and set it to false.
    
    try {
        const existing = await db.weeklySport.findUnique({
             where: { weekNumber_year: { weekNumber, year } }
        });

        if (!existing) return { success: false };

        // Reverse order of check to find the last active one
        // Priority: Run2 -> Run1 -> Gym2 -> Gym1 (Reverse of addition?)
        // Wait, user just clicks "+". Usually we fill random or specific order.
        // Let's uncheck the "highest" index.
        // Actually, SportWidget fills: gym1, run1, gym2, run2 ? Or whatever is missing.
        // Let's reverse the order of filling used in Widget.
        
        const keys: (keyof typeof existing)[] = ['run2', 'gym2', 'run1', 'gym1']; // Reverse order
        // We need to cast or be careful.
        
        for (const key of keys) {
            // @ts-ignore
            if (existing[key] === true) {
                await db.weeklySport.update({
                    where: { id: existing.id },
                    data: { [key]: false }
                });
                revalidatePath("/sport");
                revalidatePath("/");
                return { success: true };
            }
        }
        
        return { success: false, reason: "Nothing to undo" };

    } catch (error) {
         return { success: false, error };
    }
}
