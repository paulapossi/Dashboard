'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

import { startOfWeek } from "date-fns"

// --- 1. LOG LADEN ODER ERSTELLEN ---
export async function getTodayLog() {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Auf 0 Uhr setzen für Vergleich

  // Wir suchen ein Log, das nach heute 0 Uhr erstellt wurde
  let log = await db.dailyLog.findFirst({
    where: {
      date: {
        gte: today
      }
    }
  })

  // Wenn keins da ist, erstellen wir ein leeres "Gerüst" im Speicher (nicht DB)
  // damit die UI nicht abstürzt. Gespeichert wird erst beim Update.
  if (!log) {
    return null
  }

  return log
}

export async function getWeeklyUniStats() {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    
    try {
        const entries = await db.dailyLog.findMany({
            where: {
                date: { gte: weekStart },
                actualDeepWorkMinutes: { gt: 0 }
            }
        });
        
        return {
            sessions: entries.length,
            weeklyGoal: 7
        };
    } catch (error) {
        return { sessions: 0, weeklyGoal: 7 };
    }
}

// Bessere Action zum schnellen Loggen einer Session (z.B. +1h)
export async function quickLogUniSession() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    try {
        const existing = await db.dailyLog.findFirst({
            where: { date: { gte: today } }
        });
        
        if (existing) {
            await db.dailyLog.update({
                where: { id: existing.id },
                data: { actualDeepWorkMinutes: (existing.actualDeepWorkMinutes || 0) + 60 }
            });
        } else {
            await db.dailyLog.create({
                data: {
                    date: new Date(),
                    actualDeepWorkMinutes: 60,
                    goalDeepWorkMinutes: 120 // Default Goal
                }
            });
        }
        
        revalidatePath("/uni");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

// --- 2. LOG UPDATEN (DAS HERZSTÜCK) ---
export async function updateDailyLog(formData: FormData) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Wir suchen erst, ob es schon ein Log gibt
  const existingLog = await db.dailyLog.findFirst({
    where: { date: { gte: today } }
  })

  // Daten aus dem Formular holen
  const data = {
    mainTask: formData.get('mainTask') as string,
    goalDeepWorkMinutes: Number(formData.get('goalDeepWorkMinutes')) || 0,
    actualDeepWorkMinutes: Number(formData.get('actualDeepWorkMinutes')) || 0,
    focusLevel: Number(formData.get('focusLevel')) || 0,
    outputProduced: formData.get('outputProduced') === 'on',
    technicalConcept: formData.get('technicalConcept') as string,
    businessExplanation: formData.get('businessExplanation') as string,
    topic: formData.get('topic') as string,
    canExplain: formData.get('canExplain') === 'on',
    realityCheckBusy: formData.get('realityCheckBusy') === 'on',
    realityCheckAvoided: formData.get('realityCheckAvoided') === 'on',
  }

  if (existingLog) {
    await db.dailyLog.update({
      where: { id: existingLog.id },
      data: data
    })
  } else {
    await db.dailyLog.create({
      data: {
        date: new Date(),
        ...data
      }
    })
  }

  revalidatePath('/uni')
}

// --- 3. TASKS MANAGEMENT ---
export async function getTasks() {
  const critical = await db.uniTask.findMany({
    where: { priority: 'CRITICAL', isDone: false },
    orderBy: { createdAt: 'desc' }
  })
  
  const important = await db.uniTask.findMany({
    where: { priority: 'IMPORTANT', isDone: false },
    orderBy: { createdAt: 'desc' }
  })

  return { critical, important }
}

export async function addTask(formData: FormData) {
  const title = formData.get('title') as string
  const priority = formData.get('priority') as string

  if (!title) return

  await db.uniTask.create({
    data: {
      title,
      priority,
      deadline: priority === 'CRITICAL' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null
    }
  })

  revalidatePath('/uni')
}

export async function toggleTask(id: string, isDone: boolean) {
  await db.uniTask.update({
    where: { id },
    data: { isDone }
  })
  revalidatePath('/uni')
}