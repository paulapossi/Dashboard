import DashboardClient from "@/components/dashboard/DashboardClient";
import { getWeeklySport } from "@/actions/sport-actions";
import { getWeeklyReading } from "@/actions/reading-actions";
import { getTodayNutrition } from "@/actions/nutrition-actions";
import { getTodayRelationship, getWeeklyStats } from "@/actions/relationship-actions";
import { getMentalData } from "@/actions/mental-actions";
import { getWeeklyUniStats } from "@/actions/uni-actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    // 1. Alle Daten parallel laden (Ohne Cache, um Sync-Probleme zu vermeiden)
    const [
        sportDataRaw,
        readingDataRaw,
        nutritionDataRaw,
        relationshipToday,
        relationshipStats,
        mentalData,
        uniStats
    ] = await Promise.all([
        getWeeklySport(),
        getWeeklyReading(),
        getTodayNutrition(),
        getTodayRelationship(),
        getWeeklyStats(),
        getMentalData(),
        getWeeklyUniStats()
    ]);

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

    const nutritionData = {
        protein: nutritionDataRaw.protein,
        vitamins: nutritionDataRaw.vitamins,
        water: nutritionDataRaw.water,
        sweets: nutritionDataRaw.sweets,
    };

    const relationshipData = {
        isTogether: relationshipToday.isTogether,
        daysTogether: relationshipStats.daysTogether,
        weeklyGoal: relationshipStats.weeklyGoal,
    };

    const mentalDataClean = {
        meTimeHours: mentalData.meTimeHours,
        weeklyGoal: 5
    };

    const uniDataClean = {
        sessions: uniStats.sessions,
        weeklyGoal: uniStats.weeklyGoal
    };

    return (
        <DashboardClient 
            sportData={sportData} 
            readingData={readingData} 
            nutritionData={nutritionData} 
            relationshipData={relationshipData}
            mentalData={mentalDataClean}
            uniData={uniDataClean}
        />
    );
}