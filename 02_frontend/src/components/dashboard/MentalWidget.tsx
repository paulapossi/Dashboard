"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { updateMeTime } from "@/actions/mental-actions";

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

    const handleCardClick = () => {
        router.push("/mental");
    };

    const progressPercent = Math.min((hours / WEEKLY_GOAL) * 100, 100);

    const getColorStatus = (count: number) => {
        if (count >= WEEKLY_GOAL) return { stroke: "#a855f7", shadow: "rgba(168,85,247,0.6)" };
        if (count >= 1) return { stroke: "#c084fc", shadow: "rgba(192,132,252,0.6)" };
        return { stroke: "#7e22ce", shadow: "rgba(126,34,206,0.4)" };
    };

    const currentStyle = getColorStatus(hours);

    if (!mounted) return null;

    return (
        <div onClick={handleCardClick} className="block h-full w-full cursor-pointer">
            <div className="h-full w-full bg-gradient-to-br from-slate-900/80 to-purple-900/20 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-purple-500/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-transform duration-300 will-change-transform">

                <div className="flex justify-between items-start pointer-events-none">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Mental</h3>
                        <p className="text-purple-200/50 text-xs mt-0.5">Me Time & Reflect</p>
                    </div>
                    <div className="text-purple-500/20"><Brain size={20} /></div>
                </div>

                <div className="flex-1 flex items-center justify-center py-2 pointer-events-none">
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

                <div className="flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pointer-events-none">
                        ZIEL: {hours} / {WEEKLY_GOAL} STUNDEN
                    </span>

                    <button
                        onClick={handleAddSession}
                        disabled={isPending}
                        className={`
                        w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 z-20 relative
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
                </div>
            </div>
        </div>
    );
}
