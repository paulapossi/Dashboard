"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getISOWeek, getYear } from "date-fns";

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
  const year = getYear(now);

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
  const year = getYear(now);

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
