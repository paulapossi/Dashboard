import DashboardClient from "@/components/dashboard/DashboardClient";
import { getWeeklySport } from "@/actions/sport-actions";
import { getWeeklyReading } from "@/actions/reading-actions";

// Dies ist jetzt eine Server Component (Standard in Next.js 13+ App Router)
// Wir holen hier die Daten und geben sie an den Client-Teil weiter.

export default async function DashboardPage() {
    // 1. Daten laden
    const sportDataRaw = await getWeeklySport();
    const readingDataRaw = await getWeeklyReading();

    // 2. Daten für den Client aufbereiten
    const sportData = {
        gym1: sportDataRaw.gym1,
        gym2: sportDataRaw.gym2,
        run1: sportDataRaw.run1,
        run2: sportDataRaw.run2,
    };

    const readingData = {
        day1: readingDataRaw.day1,
        day2: readingDataRaw.day2,
        day3: readingDataRaw.day3,
        day4: readingDataRaw.day4,
        day5: readingDataRaw.day5,
        day6: readingDataRaw.day6,
        day7: readingDataRaw.day7,
    };

    return <DashboardClient sportData={sportData} readingData={readingData} />;
}