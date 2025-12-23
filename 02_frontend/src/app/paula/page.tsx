import Sidebar from "@/components/Sidebar";
import PaulaClient from "@/components/relationship/PaulaClient";
import { getTodayRelationship, getRelationshipHistory, getWeeklyStats } from "@/actions/relationship-actions";

export default async function PaulaPage() {
    const todayData = await getTodayRelationship();
    const history = await getRelationshipHistory();
    const weeklyStats = await getWeeklyStats();

    return (
        <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans selection:bg-rose-500/30">
            {/* SIDEBAR WRAPPER */}
            <div className="relative z-50 h-full flex-shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
                {/* BACKGROUND */}
                <div className="fixed top-0 left-0 right-0 h-full pointer-events-none overflow-hidden z-0 bg-[#0f1115]">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 via-[#0f1115] to-[#0f1115] opacity-70"></div>
                    <div className="absolute top-[-15%] right-[-20%] w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[130px] mix-blend-screen"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-700/15 rounded-full blur-[100px] mix-blend-screen"></div>
                </div>

                <div className="relative z-10 w-full h-full">
                    <PaulaClient 
                        todayData={todayData} 
                        history={history} 
                        weeklyStats={weeklyStats}
                    />
                </div>
            </main>
        </div>
    );
}
