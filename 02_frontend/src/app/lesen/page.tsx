import Sidebar from "@/components/Sidebar";
import ReadingClient from "@/components/reading/ReadingClient";
import { getWeeklyReading } from "@/actions/reading-actions";

export default async function LesenPage() {
    const readingData = await getWeeklyReading();

    // Mapping DB to Client Type
    const initialData = {
        day1: readingData.day1,
        day2: readingData.day2,
        day3: readingData.day3,
        day4: readingData.day4,
        day5: readingData.day5,
        day6: readingData.day6,
        day7: readingData.day7,
    };

    return (
        <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans">
            <div className="relative z-50 h-full flex-shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
                {/* BACKGROUND */}
                <div className="fixed top-0 left-0 right-0 h-full pointer-events-none overflow-hidden z-0 bg-[#0f1115]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0f1115] to-[#0f1115]"></div>
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                </div>

                <div className="relative z-10 w-full h-full">
                    <ReadingClient initialData={initialData} />
                </div>
            </main>
        </div>
    );
}