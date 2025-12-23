"use client";

import { useState, useEffect } from "react";
import { Search, Bell, UserCircle, Leaf, Droplet, Pill, Utensils, Cookie, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toggleNutritionHabit } from "@/actions/nutrition-actions";
import { useRouter } from "next/navigation";

type NutritionData = {
    protein: boolean;
    vitamins: boolean;
    water: boolean;
    sweets: boolean;
};

interface NutritionClientProps {
    initialData: NutritionData;
}

export default function NutritionClient({ initialData }: NutritionClientProps) {
    const router = useRouter();
    const [data, setData] = useState<NutritionData>(initialData);
    const [isPending, setIsPending] = useState(false);

    // Sync with server data
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleToggle = async (key: keyof NutritionData) => {
        const newData = { ...data, [key]: !data[key] };
        setData(newData);

        setIsPending(true);
        try {
            await toggleNutritionHabit(key);
            router.refresh();
        } catch (error) {
            console.error("Failed to toggle nutrition habit:", error);
            setData(data); // Rollback
        } finally {
            setIsPending(false);
        }
    };

    const completedCount = Object.values(data).filter(Boolean).length;
    const DAILY_GOAL = 4;
    const progressPercent = (completedCount / DAILY_GOAL) * 100;

    const getProgressColor = (count: number) => {
        if (count >= 4) return { stroke: "#10b981", shadow: "rgba(16,185,129,0.6)", label: "Clean & Strong 🌱" };
        if (count === 3) return { stroke: "#34d399", shadow: "rgba(52,211,153,0.6)", label: "Fast perfekt" };
        return { stroke: "#059669", shadow: "rgba(5,150,105,0.4)", label: "Fuel your body" };
    };

    const currentStatus = getProgressColor(completedCount);

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto p-6 md:p-8 gap-8">
            <header className="flex justify-between items-center relative z-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        Ernährung & Bio-Log <Leaf className="text-emerald-400" size={24} />
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Daily Fuel Check</p>
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
                <div className="flex flex-col gap-8">
                    <div className="bg-gradient-to-br from-slate-900/60 to-emerald-900/20 backdrop-blur-md border border-white/10 rounded-[32px] p-8 flex flex-col justify-between shadow-lg min-h-[300px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white">Tagesbilanz</h3>
                                <p className="text-emerald-200/50 text-sm">Heute</p>
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs border border-emerald-500/20">
                                4 Habits
                            </div>
                        </div>

                        <div className="flex items-center gap-8 mt-6">
                            <div className="relative w-40 h-40 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="#334155" strokeWidth="12" fill="transparent" opacity="0.5" />
                                    <motion.circle
                                        cx="80" cy="80" r="70"
                                        stroke={currentStatus.stroke}
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeLinecap="round"
                                        strokeDasharray="440"
                                        animate={{ strokeDashoffset: 440 - (440 * progressPercent / 100) }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        style={{ filter: `drop-shadow(0 0 15px ${currentStatus.shadow})` }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-white">
                                        {Math.round(progressPercent)}<span className="text-lg text-slate-400">%</span>
                                    </span>
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex-1">
                                <p className="text-sm text-emerald-100 font-medium">🌱 Status:</p>
                                <p className="text-xs text-emerald-200/70 mt-1">{currentStatus.label}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-2xl h-full flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white">Deine Checkliste</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div onClick={() => handleToggle('protein')} className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-5 group ${data.protein ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/60'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${data.protein ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                {data.protein ? <Check size={24} strokeWidth={3} /> : <Utensils size={24} />}
                            </div>
                            <div><h4 className={`font-bold ${data.protein ? 'text-white' : 'text-slate-300'}`}>Proteine</h4><p className="text-xs text-slate-500">Muskelerhalt</p></div>
                        </div>

                        <div onClick={() => handleToggle('vitamins')} className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-5 group ${data.vitamins ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/60'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${data.vitamins ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                {data.vitamins ? <Check size={24} strokeWidth={3} /> : <Pill size={24} />}
                            </div>
                            <div><h4 className={`font-bold ${data.vitamins ? 'text-white' : 'text-slate-300'}`}>Vitamine</h4><p className="text-xs text-slate-500">Supplements Stack</p></div>
                        </div>

                        <div onClick={() => handleToggle('water')} className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-5 group ${data.water ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/60'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${data.water ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                {data.water ? <Check size={24} strokeWidth={3} /> : <Droplet size={24} />}
                            </div>
                            <div><h4 className={`font-bold ${data.water ? 'text-white' : 'text-slate-300'}`}>Hydration</h4><p className="text-xs text-slate-500">Wasser Aufnahme</p></div>
                        </div>

                        <div onClick={() => handleToggle('sweets')} className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-5 group ${data.sweets ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/60'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${data.sweets ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                {data.sweets ? <Check size={24} strokeWidth={3} /> : <Cookie size={24} />}
                            </div>
                            <div><h4 className={`font-bold ${data.sweets ? 'text-white' : 'text-slate-300'}`}>Keine Süßigkeiten</h4><p className="text-xs text-slate-500">Zuckerfrei</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
