"use client";

import { useState, useEffect } from "react";
import { Search, Bell, UserCircle, Activity, Dumbbell, Zap, Flame, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toggleSportUnit } from "@/actions/sport-actions";
import { useRouter } from "next/navigation";

// Datentyp
type SportData = {
    gym1: boolean;
    gym2: boolean;
    run1: boolean;
    run2: boolean;
};

interface SportClientProps {
    initialData: SportData;
}

export default function SportClient({ initialData }: SportClientProps) {
    const router = useRouter();
    // Optimistic UI: Wir starten mit den Server-Daten
    const [data, setData] = useState<SportData>(initialData);
    const [isPending, setIsPending] = useState(false);

    // Sync state with server data on refresh
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Toggle Funktion
    const handleToggle = async (key: keyof SportData) => {
        // 1. Optimistic Update
        const newData = { ...data, [key]: !data[key] };
        setData(newData);

        // 2. Server Action aufrufen
        setIsPending(true);
        try {
            await toggleSportUnit(key);
            router.refresh(); // Server-Daten neu laden, um sicherzugehen
        } catch (error) {
            console.error("Failed to toggle:", error);
            // Rollback bei Fehler
            setData(data);
        } finally {
            setIsPending(false);
        }
    };

    // Berechnungen für den Kreis
    const completedCount = Object.values(data).filter(Boolean).length;
    const WEEKLY_GOAL = 4;
    const progressPercent = (completedCount / WEEKLY_GOAL) * 100;

    // Farb-Logik
    const getProgressColor = (count: number) => {
        if (count >= 4) return { stroke: "#22c55e", shadow: "rgba(34,197,94,0.6)", label: "Maschine! 🔥" };
        if (count === 3) return { stroke: "#06b6d4", shadow: "rgba(6,182,212,0.6)", label: "Endspurt" };
        return { stroke: "#3b82f6", shadow: "rgba(59,130,246,0.6)", label: "Keep going" };
    };

    const currentStatus = getProgressColor(completedCount);

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto p-6 md:p-8 gap-8">
             {/* HEADER */}
             <header className="flex justify-between items-center relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            Sport & Fitness <Activity className="text-cyan-400" size={24} />
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Wochenziel: 2x Gym, 2x Cardio</p>
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

                {/* CONTENT */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">

                    {/* LINKE SPALTE: STATUS KREIS */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-gradient-to-br from-slate-900/60 to-blue-950/30 backdrop-blur-md border border-white/10 rounded-[32px] p-8 flex flex-col justify-between shadow-lg min-h-[300px]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Dein Fortschritt</h3>
                                    <p className="text-cyan-200/50 text-sm">Diese Woche</p>
                                </div>
                                <div className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs border border-cyan-500/20">
                                    {completedCount} Einheiten
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
                                            {completedCount} <span className="text-lg text-slate-400">/ 4</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-2xl flex-1">
                                    <p className="text-sm text-cyan-100 font-medium">🚀 Status:</p>
                                    <p className="text-xs text-cyan-200/70 mt-1">{currentStatus.label}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RECHTE SPALTE: DIE 4 CHECKBOXEN */}
                    <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-2xl h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Wochenplan</h3>
                            <Flame className="text-orange-500" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* GYM 1 */}
                            <div
                                onClick={() => handleToggle('gym1')}
                                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 group
                        ${data.gym1 ? 'bg-blue-600 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <Dumbbell className={data.gym1 ? "text-white" : "text-blue-400"} />
                                    {data.gym1 && <Check className="text-white" />}
                                </div>
                                <span className={`font-bold ${data.gym1 ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>Gym Session 1</span>
                            </div>

                            {/* GYM 2 */}
                            <div
                                onClick={() => handleToggle('gym2')}
                                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 group
                        ${data.gym2 ? 'bg-blue-600 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <Dumbbell className={data.gym2 ? "text-white" : "text-blue-400"} />
                                    {data.gym2 && <Check className="text-white" />}
                                </div>
                                <span className={`font-bold ${data.gym2 ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>Gym Session 2</span>
                            </div>

                            {/* RUN 1 */}
                            <div
                                onClick={() => handleToggle('run1')}
                                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 group
                        ${data.run1 ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <Zap className={data.run1 ? "text-white" : "text-cyan-400"} />
                                    {data.run1 && <Check className="text-white" />}
                                </div>
                                <span className={`font-bold ${data.run1 ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>Cardio / Run 1</span>
                            </div>

                            {/* RUN 2 */}
                            <div
                                onClick={() => handleToggle('run2')}
                                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 group
                        ${data.run2 ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <Zap className={data.run2 ? "text-white" : "text-cyan-400"} />
                                    {data.run2 && <Check className="text-white" />}
                                </div>
                                <span className={`font-bold ${data.run2 ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>Cardio / Run 2</span>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}