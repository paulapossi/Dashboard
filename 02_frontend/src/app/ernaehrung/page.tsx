import Sidebar from "@/components/Sidebar";
import NutritionClient from "@/components/nutrition/NutritionClient";
import { getTodayNutrition, getNutritionHistory } from "@/actions/nutrition-actions";

export default async function NutritionPage() {
    const nutritionData = await getTodayNutrition();
    const historyData = await getNutritionHistory();

    const initialData = {
        protein: nutritionData.protein,
        vitamins: nutritionData.vitamins,
        water: nutritionData.water,
        sweets: nutritionData.sweets,
    };

    return (
        <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans">
            <div className="relative z-50 h-full flex-shrink-0"><Sidebar /></div>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
                <div className="fixed top-0 left-0 right-0 h-full pointer-events-none overflow-hidden z-0 bg-[#0f1115]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0f1115] to-[#0f1115]"></div>
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                </div>

                <div className="relative z-10 w-full h-full">
                    <NutritionClient initialData={initialData} history={historyData} />
                </div>
            </main>
        </div>
    );
}
