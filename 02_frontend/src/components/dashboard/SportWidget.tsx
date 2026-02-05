"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, Minus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toggleSportUnit } from "@/actions/sport-actions";
import { useRouter } from "next/navigation";
import { calculateSportProgress, getCompletedCount } from "@/lib/progress-calculator";
import { WEEKLY_GOALS } from "@/lib/constants";

// Muss exakt gleich sein wie in der Page/Action
type SportData = {
    gym1: boolean;
    gym2: boolean;
    run1: boolean;
    run2: boolean;
};

interface SportWidgetProps {
    initialData?: SportData;
}

export default function SportWidget({ initialData }: SportWidgetProps) {
    const router = useRouter();
    const [data, setData] = useState<SportData>(initialData || {
        gym1: false, gym2: false, run1: false, run2: false
    });
    
    const [mounted, setMounted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync with server data
    useEffect(() => {
        if (initialData) {
            setData(initialData);
        }
    }, [initialData]);

    const completedCount = getCompletedCount(data);
    const progressPercent = calculateSportProgress(data);

    const handleToggleBadge = async (type: 'gym' | 'cardio', e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        // Determine which key to toggle based on current state
        let key: keyof SportData | null = null;
        
        if (type === 'gym') {
            // Toggle gym: if none done, set gym1. If gym1 done, set gym2. If both done, unset gym2.
            if (!data.gym1) key = 'gym1';
            else if (!data.gym2) key = 'gym2';
            else key = 'gym2'; // Unset gym2
        } else {
            // Toggle cardio: if none done, set run1. If run1 done, set run2. If both done, unset run2.
            if (!data.run1) key = 'run1';
            else if (!data.run2) key = 'run2';
            else key = 'run2'; // Unset run2
        }

        if (key) {
            const newData = { ...data, [key]: !data[key] };
            setData(newData);

            setIsPending(true);
            try {
                await toggleSportUnit(key);
                router.refresh();
            } catch (error) {
                console.error("Failed to toggle sport unit:", error);
                setData(data); // Rollback
            } finally {
                setIsPending(false);
            }
        }
    };

    const handleUndoBadge = async (type: 'gym' | 'cardio', e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        // Undo: remove last completed session
        let key: keyof SportData | null = null;
        
        if (type === 'gym') {
            if (data.gym2) key = 'gym2';
            else if (data.gym1) key = 'gym1';
        } else {
            if (data.run2) key = 'run2';
            else if (data.run1) key = 'run1';
        }

        if (key) {
            const newData = { ...data, [key]: false };
            setData(newData);

            setIsPending(true);
            try {
                await toggleSportUnit(key);
                router.refresh();
            } catch (error) {
                console.error("Failed to undo sport unit:", error);
                setData(data); // Rollback
            } finally {
                setIsPending(false);
            }
        }
    };

    const getColorStatus = (count: number) => {
        if (count >= 4) return { stroke: "#22c55e", shadow: "rgba(34,197,94,0.6)" };
        if (count === 3) return { stroke: "#06b6d4", shadow: "rgba(6,182,212,0.6)" };
        if (count >= 1) return { stroke: "#3b82f6", shadow: "rgba(59,130,246,0.6)" };
        return { stroke: "#64748b", shadow: "rgba(100,116,139,0.4)" };
    };

    const currentStyle = getColorStatus(completedCount);

    if (!mounted) return null;

    return (
        <div className="relative h-full w-full group cursor-pointer transition-colors duration-300">
            <Link href="/sport" className="absolute inset-0 z-10" />

            <div className="h-full w-full bg-gradient-to-br from-slate-900/60 to-blue-900/20 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative z-20 overflow-hidden hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] pointer-events-none">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">Sport</h3>
                        <p className="text-blue-200/50 text-xs mt-0.5">2x Run • 2x Gym</p>
                    </div>
                    <div className="text-slate-500 text-xl">⋮</div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-2 gap-4">
                    <div className="text-5xl font-bold text-white">
                        {completedCount}
                    </div>
                    
                    {/* Gym & Cardio Badges */}
                    <div className="flex flex-col gap-2 w-full px-3 relative z-20 pointer-events-auto">
                        {/* Gym Badge */}
                        <div className="flex gap-2">
                            <motion.button
                                onClick={(e) => handleToggleBadge('gym', e)}
                                disabled={isPending}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1, type: "spring" }}
                                className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 active:scale-95 ${
                                    (data.gym1 || data.gym2)
                                        ? 'bg-blue-500/20 border border-blue-500/40' 
                                        : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/70'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🏋️</span>
                                    <span className={`text-sm font-semibold ${
                                        (data.gym1 || data.gym2) ? 'text-blue-300' : 'text-slate-400'
                                    }`}>Gym</span>
                                </div>
                                <div className="flex gap-1.5">
                                    {[data.gym1, data.gym2].map((done, i) => (
                                        <div
                                            key={i}
                                            className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                                                done 
                                                    ? 'bg-blue-400 border-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' 
                                                    : 'bg-transparent border-slate-600'
                                            }`}
                                        >
                                            {done && <Check size={10} className="text-white" strokeWidth={3} />}
                                        </div>
                                    ))}
                                </div>
                            </motion.button>
                            {(data.gym1 || data.gym2) && (
                                <button
                                    onClick={(e) => handleUndoBadge('gym', e)}
                                    disabled={isPending}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-all active:scale-95"
                                >
                                    <Minus size={14} />
                                </button>
                            )}
                        </div>

                        {/* Cardio Badge */}
                        <div className="flex gap-2">
                            <motion.button
                                onClick={(e) => handleToggleBadge('cardio', e)}
                                disabled={isPending}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 active:scale-95 ${
                                    (data.run1 || data.run2)
                                        ? 'bg-green-500/20 border border-green-500/40' 
                                        : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/70'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🏃</span>
                                    <span className={`text-sm font-semibold ${
                                        (data.run1 || data.run2) ? 'text-green-300' : 'text-slate-400'
                                    }`}>Ausdauer</span>
                                </div>
                                <div className="flex gap-1.5">
                                    {[data.run1, data.run2].map((done, i) => (
                                        <div
                                            key={i}
                                            className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                                                done 
                                                    ? 'bg-green-400 border-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' 
                                                    : 'bg-transparent border-slate-600'
                                            }`}
                                        >
                                            {done && <Check size={10} className="text-white" strokeWidth={3} />}
                                        </div>
                                    ))}
                                </div>
                            </motion.button>
                            {(data.run1 || data.run2) && (
                                <button
                                    onClick={(e) => handleUndoBadge('cardio', e)}
                                    disabled={isPending}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-all active:scale-95"
                                >
                                    <Minus size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <span className="text-xs text-slate-400 pointer-events-none">
                        {Math.round(progressPercent)}% Complete • {completedCount}/4
                    </span>
                </div>
            </div>
        </div>
    );
}