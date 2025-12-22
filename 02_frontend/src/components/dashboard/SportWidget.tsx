"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Muss exakt gleich sein wie in der Page
type SportData = {
    gym1: boolean;
    gym2: boolean;
    run1: boolean;
    run2: boolean;
};

export default function SportWidget() {
    const [data, setData] = useState<SportData>({
        gym1: false, gym2: false, run1: false, run2: false
    });
    const [mounted, setMounted] = useState(false);

    // 1. Daten laden (Sync mit Page)
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("sport-data-v1");
        if (saved) setData(JSON.parse(saved));
    }, []);

    // 2. Button Logik: Die nächste offene Einheit abhaken
    const handleQuickAdd = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Wir suchen den ersten Key, der false ist
        const keys: (keyof SportData)[] = ['gym1', 'run1', 'gym2', 'run2']; // Priorität
        const nextKey = keys.find(key => !data[key]);

        if (nextKey) {
            const newData = { ...data, [nextKey]: true };
            setData(newData);
            localStorage.setItem("sport-data-v1", JSON.stringify(newData));
        } else {
            // Wenn alles voll ist, resetten wir zum Testen (oder wir lassen es voll)
            // Optional: Reset
            // const resetData = { gym1: false, gym2: false, run1: false, run2: false };
            // setData(resetData);
            // localStorage.setItem("sport-data-v1", JSON.stringify(resetData));
        }
    };

    // Berechnung
    const completedCount = Object.values(data).filter(Boolean).length;
    const WEEKLY_GOAL = 4;
    const progressPercent = (completedCount / WEEKLY_GOAL) * 100;

    // Farben
    const getColorStatus = (count: number) => {
        if (count >= 4) return { stroke: "#22c55e", shadow: "rgba(34,197,94,0.6)" };
        if (count === 3) return { stroke: "#06b6d4", shadow: "rgba(6,182,212,0.6)" };
        if (count >= 1) return { stroke: "#3b82f6", shadow: "rgba(59,130,246,0.6)" };
        return { stroke: "#64748b", shadow: "rgba(100,116,139,0.4)" };
    };

    const currentStyle = getColorStatus(completedCount);

    if (!mounted) return null;

    return (
        <Link href="/sport" className="block h-full w-full">
            <div className="h-full w-full bg-gradient-to-br from-slate-900/60 to-blue-900/20 backdrop-blur-md border border-white/10 rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-blue-500/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-transform duration-300 will-change-transform cursor-pointer">

                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">Sport</h3>
                        <p className="text-blue-200/50 text-xs mt-0.5">2x Run • 2x Gym</p>
                    </div>
                    <div className="text-slate-500 text-xl">⋮</div>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex items-center justify-center py-2">
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="10" fill="transparent" opacity="0.3" />
                            <motion.circle
                                cx="64" cy="64" r="56"
                                stroke={currentStyle.stroke}
                                strokeWidth="10"
                                fill="transparent"
                                strokeLinecap="round"
                                strokeDasharray="351"
                                animate={{ strokeDashoffset: 351 - (351 * progressPercent / 100) }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ filter: `drop-shadow(0 0 15px ${currentStyle.shadow})` }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{Math.round(progressPercent)}%</span>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        ZIEL: {completedCount} / {WEEKLY_GOAL}
                    </span>

                    <button
                        onClick={handleQuickAdd}
                        className={`
                        w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 z-20 relative
                        ${completedCount >= WEEKLY_GOAL
                                ? "bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] border border-green-500"
                                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                            }
                    `}
                    >
                        {completedCount >= WEEKLY_GOAL ? (
                            <>Fertig <Check size={16} strokeWidth={3} /></>
                        ) : (
                            <>+ Eintragen</>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}