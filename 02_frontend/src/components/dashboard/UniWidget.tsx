"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, GraduationCap, Minus } from "lucide-react";
import { calculateUniProgress } from "@/lib/progress-calculator";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { quickLogUniSession, decreaseUniSession } from "@/actions/uni-actions";

interface UniWidgetProps {
    initialData?: {
        sessions: number;
        weeklyGoal: number;
    };
}

export default function UniWidget({ initialData }: UniWidgetProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Optimistic state
    const [sessions, setSessions] = useState(initialData?.sessions ?? 0);
    const WEEKLY_GOAL = initialData?.weeklyGoal ?? 7;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync with server data
    useEffect(() => {
        if (initialData) {
            setSessions(initialData.sessions);
        }
    }, [initialData]);

    const handleAddSession = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        // Optimistic Update
        const nextSessions = sessions + 1;
        setSessions(nextSessions);

        setIsPending(true);
        try {
            await quickLogUniSession();
            router.refresh();
        } catch (error) {
            // Rollback
            setSessions(sessions);
            console.error("Failed to log uni session:", error);
        } finally {
            setIsPending(false);
        }
    };

    const handleDecreaseSession = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending || sessions <= 0) return;

        // Optimistic Update
        const nextSessions = Math.max(0, sessions - 1);
        setSessions(nextSessions);

        setIsPending(true);
        try {
            await decreaseUniSession();
            router.refresh();
        } catch (error) {
            // Rollback
            setSessions(sessions);
            console.error("Failed to decrease uni session:", error);
        } finally {
            setIsPending(false);
        }
    };

    const handleCardClick = () => {
        router.push("/uni");
    };

    const progressPercent = calculateUniProgress({ 
        sessions, 
        weeklyGoal: WEEKLY_GOAL 
    });

    const getColorStatus = (count: number) => {
        if (count >= 5) return { stroke: "#6366f1", shadow: "rgba(99,102,241,0.6)" };
        if (count >= 3) return { stroke: "#818cf8", shadow: "rgba(129,140,248,0.6)" };
        return { stroke: "#4f46e5", shadow: "rgba(79,70,229,0.4)" };
    };

    const currentStyle = getColorStatus(sessions);

    if (!mounted) return null;

        return (

            <div onClick={handleCardClick} className="block h-full w-full cursor-pointer">

                <div className="h-full w-full bg-gradient-to-br from-slate-900/60 to-indigo-900/20 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300">

                    <div className="flex justify-between items-start pointer-events-none">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">Uni</h3>
                        <p className="text-indigo-200/50 text-xs mt-0.5">1h Deep Work</p>
                    </div>
                    <div className="text-indigo-500/20"><GraduationCap size={20} /></div>
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
                        WOCHE: {sessions} / {WEEKLY_GOAL} SESSIONS
                    </span>

                    <div className="flex w-full gap-2 relative z-20 pointer-events-auto">
                         <button
                            onClick={handleAddSession}
                            disabled={isPending}
                            className={`
                            flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95
                            ${sessions >= WEEKLY_GOAL
                                    ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-500"
                                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                                }
                        `}
                        >
                            {sessions >= WEEKLY_GOAL ? (
                                <>Ziel erreicht <Check size={16} strokeWidth={3} /></>
                            ) : (
                                <>+ Done (1h)</>
                            )}
                        </button>
                        
                        {sessions > 0 && (
                             <button
                                onClick={handleDecreaseSession}
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
