"use client";

import { useState, useEffect } from "react";
import RingCard from "@/components/dashboard/RingCard";

// WIDGET IMPORTS
import RelationshipWidget from "@/components/dashboard/RelationshipWidget";
import SportWidget from "@/components/dashboard/SportWidget";
import ReadingWidget from "@/components/dashboard/ReadingWidget";
import NutritionWidget from "@/components/dashboard/NutritionWidget";
import UniWidget from "@/components/dashboard/UniWidget";
import MentalWidget from "@/components/dashboard/MentalWidget";

import Sidebar from "@/components/Sidebar";
import { Search, Bell, UserCircle, Save } from "lucide-react";
import { createBrainDump } from "@/actions/mental-actions";
import { useRouter } from "next/navigation";

// Types
type SportData = {
    gym1: boolean; gym2: boolean; run1: boolean; run2: boolean;
};
type ReadingData = {
    day1: boolean; day2: boolean; day3: boolean; day4: boolean; day5: boolean; day6: boolean; day7: boolean;
};
type NutritionData = {
    protein: boolean; vitamins: boolean; water: boolean; sweets: boolean;
};

interface DashboardClientProps {
    sportData?: SportData;
    readingData?: ReadingData;
    nutritionData?: NutritionData;
    relationshipData?: { isTogether: boolean; daysTogether: number; weeklyGoal: number };
    mentalData?: { meTimeHours: number; weeklyGoal: number };
    uniData?: { sessions: number; weeklyGoal: number };
}

export default function DashboardClient({ sportData, readingData, nutritionData, relationshipData, mentalData, uniData }: DashboardClientProps) {
    const router = useRouter();
    
    // Calculation functions for progress
    const getSportProgress = () => sportData ? Math.round((Object.values(sportData).filter(Boolean).length / 4) * 100) : 0;
    const getReadingProgress = () => readingData ? Math.round((Object.values(readingData).filter(Boolean).length / 7) * 100) : 0;
    const getNutritionProgress = () => nutritionData ? Math.round((Object.values(nutritionData).filter(Boolean).length / 4) * 100) : 0;
    const getRelationshipProgress = () => relationshipData ? Math.round((relationshipData.daysTogether / relationshipData.weeklyGoal) * 100) : 0;
    const getMentalProgress = () => mentalData ? Math.round((mentalData.meTimeHours / mentalData.weeklyGoal) * 100) : 0;
    const getUniProgress = () => uniData ? Math.round((uniData.sessions / uniData.weeklyGoal) * 100) : 0;

    // Categories state
    const [categories, setCategories] = useState([
        { id: "uni", label: "Uni", progress: getUniProgress(), color: "indigo" },
        { id: "sport", label: "Sport", progress: getSportProgress(), color: "teal" },
        { id: "lesen", label: "Lesen", progress: getReadingProgress(), color: "yellow" },
        { id: "food", label: "Ernährung", progress: getNutritionProgress(), color: "green" },
        { id: "paula", label: "Paula", progress: getRelationshipProgress(), color: "red" },
        { id: "mental", label: "Mental", progress: getMentalProgress(), color: "purple" },
    ]);

    // Sync categories when props change
    useEffect(() => {
        setCategories([
            { id: "uni", label: "Uni", progress: getUniProgress(), color: "indigo" },
            { id: "sport", label: "Sport", progress: getSportProgress(), color: "teal" },
            { id: "lesen", label: "Lesen", progress: getReadingProgress(), color: "yellow" },
            { id: "food", label: "Ernährung", progress: getNutritionProgress(), color: "green" },
            { id: "paula", label: "Paula", progress: getRelationshipProgress(), color: "red" },
            { id: "mental", label: "Mental", progress: getMentalProgress(), color: "purple" },
        ]);
    }, [sportData, readingData, nutritionData, relationshipData, mentalData, uniData]);

    const [isLoaded, setIsLoaded] = useState(false);

    // QUICK NOTE STATE
    const [quickNote, setQuickNote] = useState("");
    const [isSavingNote, setIsSavingNote] = useState(false);

    // Quick Note speichern (Jetzt in die DB!)
    const saveNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickNote.trim() || isSavingNote) return;

        setIsSavingNote(true);
        try {
            await createBrainDump(quickNote);
            setQuickNote("");
            router.refresh();
        } catch (error) {
            console.error("Failed to save quick note:", error);
        } finally {
            setIsSavingNote(false);
        }
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const updateProgress = (id: string, amount: number) => {
        // Only for fallback rings that aren't widgets yet
        setCategories((prev) => prev.map((cat) => {
            if (cat.id === id) return { ...cat, progress: Math.max(0, Math.min(100, cat.progress + amount)) };
            return cat;
        }));
    };

    if (!isLoaded) return null;

    return (
        <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans selection:bg-blue-500/30">
            <div className="relative z-50 h-full flex-shrink-0"><Sidebar /></div>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto px-6 py-8 gap-8">

                <header className="max-w-7xl mx-auto w-full flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                        <p className="text-slate-400 text-sm mt-1">Life OS • System Overview</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-slate-800/50 px-4 py-2.5 rounded-full border border-slate-700 text-slate-400 w-64">
                            <Search size={18} className="mr-3" />
                            <span className="text-sm">Search...</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            <Bell size={20} className="hover:text-white cursor-pointer" />
                            <UserCircle size={28} className="hover:text-white cursor-pointer" />
                        </div>
                    </div>
                </header>

                {/* WIDGET GRID */}
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                        const wrapperClass = "h-[320px] w-full";
                        let content = null;

                        if (cat.id === "uni") content = <UniWidget initialData={uniData} />;
                        else if (cat.id === "paula") content = <RelationshipWidget initialData={relationshipData} />;
                        else if (cat.id === "sport") content = <SportWidget initialData={sportData} />;
                        else if (cat.id === "lesen") content = <ReadingWidget initialData={readingData} />;
                        else if (cat.id === "food") content = <NutritionWidget initialData={nutritionData} />;
                        else if (cat.id === "mental") content = <MentalWidget initialData={mentalData} />;
                        else content = <RingCard id={cat.id} label={cat.label} progress={cat.progress} color={cat.color} onUpdate={(amount) => updateProgress(cat.id, amount)} />;

                        return (
                            <div key={cat.id} className={`${wrapperClass} transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10`}>
                                <div className="h-full w-full glass-border rounded-[32px] overflow-hidden">
                                    {content}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* NEURAL FLOW BAR */}
                <div className="max-w-7xl mx-auto w-full bg-[#1e293b]/60 backdrop-blur-xl rounded-[24px] p-6 border border-white/10 flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>

                    <div className="flex-1 w-full relative">
                        <form onSubmit={saveNote} className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={quickNote}
                                    onChange={(e) => setQuickNote(e.target.value)}
                                    placeholder="Quick Capture: Was beschäftigt dich gerade?"
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-4 pl-5 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                            <button type="submit" disabled={isSavingNote} className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl border border-white/5 transition-all disabled:opacity-50">
                                <Save size={20} />
                            </button>
                        </form>
                    </div>
                </div>

            </main>
        </div>
    );
}