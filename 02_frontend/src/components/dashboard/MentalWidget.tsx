"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, Brain, Minus } from "lucide-react";
import { calculateMentalProgress } from "@/lib/progress-calculator";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateMeTime, decreaseMeTime } from "@/actions/mental-actions";

interface MentalWidgetProps {
    initialData?: {
        meTimeHours: number;
        weeklyGoal: number;
    };
}

export default function MentalWidget({ initialData }: MentalWidgetProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Optimistic state
    const [hours, setHours] = useState(initialData?.meTimeHours ?? 0);
    const WEEKLY_GOAL = initialData?.weeklyGoal ?? 5;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync with server data
    useEffect(() => {
        if (initialData) {
            setHours(initialData.meTimeHours);
        }
    }, [initialData]);

    const handleAddSession = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        // Optimistic Update
        const newCount = hours + 1;
        setHours(newCount);

        setIsPending(true);
        try {
            await updateMeTime(1);
            router.refresh();
        } catch (error) {
            // Rollback
            setHours(hours);
            console.error("Failed to update Me Time:", error);
        } finally {
            setIsPending(false);
        }
    };
    
    const handleDecrease = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending || hours <= 0) return;

        const newCount = Math.max(0, hours - 1);
        setHours(newCount);

        setIsPending(true);
        try {
            await decreaseMeTime();
            router.refresh();
        } catch (error) {
             setHours(hours);
        } finally {
            setIsPending(false);
        }
    };

    const progressPercent = calculateMentalProgress({ 
        meTimeHours: hours, 
        weeklyGoal: WEEKLY_GOAL 
    });

    const getColorStatus = (count: number) => {
        if (count >= WEEKLY_GOAL) return { stroke: "#a855f7", shadow: "rgba(168,85,247,0.6)" };
        if (count >= 1) return { stroke: "#c084fc", shadow: "rgba(192,132,252,0.6)" };
        return { stroke: "#7e22ce", shadow: "rgba(126,34,206,0.4)" };
    };

    const currentStyle = getColorStatus(hours);

    if (!mounted) return null;

    return (
        <div className="relative h-full w-full group cursor-pointer transition-colors duration-300">
            <Link href="/mental" className="absolute inset-0 z-10" />

            <div className="h-full w-full bg-gradient-to-br from-slate-900/80 to-purple-900/20 rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative z-20 overflow-hidden hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] pointer-events-none">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Mental</h3>
                        <p className="text-purple-200/50 text-xs mt-0.5">Me Time & Reflect</p>
                    </div>
                    <div className="text-purple-500/20"><Brain size={20} /></div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-4 gap-4">
                    <div className="text-5xl font-bold text-white">
                        {hours}h
                    </div>
                    
                    {/* Half-Circle Gauge */}
                    <div className="relative w-40 h-20">
                        <svg width="160" height="80" viewBox="0 0 160 80" className="overflow-visible">
                            {/* Background arc */}
                            <path
                                d="M 10 70 A 70 70 0 0 1 150 70"
                                fill="none"
                                stroke="#334155"
                                strokeWidth="12"
                                opacity="0.3"
                            />
                            
                            {/* Progress arc */}
                            <motion.path
                                d="M 10 70 A 70 70 0 0 1 150 70"
                                fill="none"
                                stroke="#a855f7"
                                strokeWidth="12"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: Math.min(hours / WEEKLY_GOAL, 1) }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{ 
                                    filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.6))',
                                    strokeDasharray: 1,
                                    strokeDashoffset: 0
                                }}
                            />
                            
                            {/* Percentage text */}
                            <text
                                x="80"
                                y="65"
                                textAnchor="middle"
                                className="text-xl font-bold fill-white"
                            >
                                {Math.round(progressPercent)}%
                            </text>
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <span className="text-xs text-slate-400">
                        {WEEKLY_GOAL - hours}h verbleibend • Woche
                    </span>

                    <div className="flex w-full gap-2 relative z-20 pointer-events-auto">
                        <button
                            onClick={handleAddSession}
                            disabled={isPending}
                            className={`
                            flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95
                            ${hours >= WEEKLY_GOAL
                                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-500"
                                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                                }
                        `}
                        >
                            {hours >= WEEKLY_GOAL ? (
                                <>Mindful <Check size={16} strokeWidth={3} /></>
                            ) : (
                                <>+ Time (1h)</>
                            )}
                        </button>
                        
                        {hours > 0 && (
                             <button
                                onClick={handleDecrease}
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