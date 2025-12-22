import Sidebar from "@/components/Sidebar";
import SportClient from "@/components/sport/SportClient";
import { getWeeklySport } from "@/actions/sport-actions";

export default async function SportPage() {
    // Daten vom Server laden (DB)
    const sportData = await getWeeklySport();

    // Mapping: DB-Model zu UI-Type (optional, falls Typen nicht 100% matchen, hier aber gleich)
    // Wir übergeben nur die Booleans
    const initialData = {
        gym1: sportData.gym1,
        gym2: sportData.gym2,
        run1: sportData.run1,
        run2: sportData.run2
    };

    return (
        <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
            <div className="relative z-50 h-full flex-shrink-0"><Sidebar /></div>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
                {/* BACKGROUND */}
                <div className="fixed top-0 left-0 right-0 h-full pointer-events-none overflow-hidden z-0 bg-[#0f1115]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0f1115] to-[#0f1115]"></div>
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                </div>

                <div className="relative z-10 w-full h-full">
                    <SportClient initialData={initialData} />
                </div>
            </main>
        </div>
    );
}