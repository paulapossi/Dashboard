"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, Minus, Flame } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toggleSportUnit, undoSportUnit } from "@/actions/sport-actions";
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

    const handleQuickAdd = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        const keys: (keyof SportData)[] = ['gym1', 'run1', 'gym2', 'run2'];
        const nextKey = keys.find(key => !data[key]);

        if (nextKey) {
            // Optimistic Update
            const newData = { ...data, [nextKey]: true };
            setData(newData);
            
            setIsPending(true);
            try {
                await toggleSportUnit(nextKey);
                router.refresh();
            } catch (error) {
                console.error("Failed to toggle sport unit:", error);
                setData(data); // Rollback
            } finally {
                setIsPending(false);
            }
        }
    };

    const handleUndo = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;
        
        // Optimistic undo: find last active
        const keys: (keyof SportData)[] = ['run2', 'gym2', 'run1', 'gym1'];
        const lastKey = keys.find(key => data[key]);

        if (lastKey) {
            const newData = { ...data, [lastKey]: false };
            setData(newData);

            setIsPending(true);
            try {
                await undoSportUnit();
                router.refresh();
            } catch (error) {
                setData(data);
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

                <div className="flex-1 flex flex-col items-center justify-center py-2 gap-3">
                    <div className="text-5xl font-bold text-white">
                        {completedCount}
                    </div>
                    
                    {/* Streak Dots */}
                    <div className="flex gap-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.05, type: "spring" }}
                                className={`w-4 h-4 rounded-full ${
                                    index < completedCount
                                        ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-[0_0_10px_rgba(34,197,94,0.6)]'
                                        : 'bg-slate-800 border border-slate-700'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Mini Bar Chart */}
                    <div className="flex items-end gap-2 h-12">
                        {[2, 3, 4, 3].map((value, index) => {
                            const isActive = index < completedCount;
                            const height = (value / 4) * 100;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                                    className={`w-6 rounded-t ${
                                        isActive
                                            ? 'bg-gradient-to-t from-green-500 to-green-400'
                                            : 'bg-slate-800'
                                    }`}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <span className="text-xs text-slate-400">
                        {Math.round(progressPercent)}% Complete • Streak: {completedCount}
                    </span>

                    <div className="flex w-full gap-2 relative z-20 pointer-events-auto">
                        <button
                            onClick={handleQuickAdd}
                            disabled={isPending}
                            className={`
                            flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95
                            ${completedCount >= WEEKLY_GOALS.SPORT_SESSIONS
                                    ? "bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] border border-green-500"
                                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                                }
                        `}
                        >
                            {completedCount >= WEEKLY_GOALS.SPORT_SESSIONS ? (
                                <>Fertig <Check size={16} strokeWidth={3} /></>
                            ) : (
                                <>+ Eintragen</>
                            )}
                        </button>
                        
                        {completedCount > 0 && (
                            <button
                                onClick={handleUndo}
                                disabled={isPending}
                                className="w-12 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-all active:scale-95"
                            >
                                <Minus size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}