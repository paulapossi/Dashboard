"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toggleTogether } from "@/actions/relationship-actions";
import { useRouter } from "next/navigation";

interface RelationshipWidgetProps {
    initialData?: {
        isTogether: boolean;
        daysTogether: number;
        weeklyGoal: number;
    };
}

export default function RelationshipWidget({ initialData }: RelationshipWidgetProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Optimistic state
    const [isTogetherToday, setIsTogetherToday] = useState(initialData?.isTogether ?? false);
    const [daysTogether, setDaysTogether] = useState(initialData?.daysTogether ?? 0);
    const weeklyGoal = initialData?.weeklyGoal ?? 4;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync with server data when it changes
    useEffect(() => {
        if (initialData) {
            setIsTogetherToday(initialData.isTogether);
            setDaysTogether(initialData.daysTogether);
        }
    }, [initialData]);

    const handleToggle = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        // Optimistic Update
        const nextState = !isTogetherToday;
        setIsTogetherToday(nextState);
        setDaysTogether(prev => nextState ? prev + 1 : Math.max(0, prev - 1));

        setIsPending(true);
        try {
            await toggleTogether();
            router.refresh();
        } catch (error) {
            // Rollback on error
            setIsTogetherToday(!nextState);
            setDaysTogether(prev => !nextState ? prev + 1 : Math.max(0, prev - 1));
            console.error("Failed to toggle relationship status:", error);
        } finally {
            setIsPending(false);
        }
    };

    const progressPercent = Math.min((daysTogether / weeklyGoal) * 100, 100);

    const getColorStatus = (days: number) => {
        if (days >= 4) return { stroke: "#e11d48", shadow: "rgba(225,29,72,0.6)" };
        if (days === 3) return { stroke: "#f472b6", shadow: "rgba(244,114,182,0.6)" };
        if (days === 2) return { stroke: "#facc15", shadow: "rgba(250,204,21,0.6)" };
        return { stroke: "#94a3b8", shadow: "rgba(148,163,184,0.4)" };
    };

    const currentColor = getColorStatus(daysTogether);

    if (!mounted) return null;

    return (
        <Link href="/paula" className="block h-full w-full">
            <div className="h-full w-full bg-gradient-to-br from-slate-900/60 to-rose-900/20 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-rose-500/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(225,29,72,0.2)] transition-transform duration-300 will-change-transform cursor-pointer">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-rose-200 transition-colors">Paula</h3>
                        <p className="text-rose-200/50 text-xs mt-0.5">Gemeinsame Zeit</p>
                    </div>
                    <div className="text-rose-500/20"><Heart size={20} /></div>
                </div>

                <div className="flex-1 flex items-center justify-center py-2">
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="10" fill="transparent" opacity="0.3" />
                            <motion.circle
                                cx="64" cy="64" r="56"
                                stroke={currentColor.stroke}
                                strokeWidth="10"
                                fill="transparent"
                                strokeLinecap="round"
                                strokeDasharray="351"
                                animate={{ strokeDashoffset: 351 - (351 * progressPercent / 100) }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ filter: `drop-shadow(0 0 15px ${currentColor.shadow})` }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{Math.round(progressPercent)}%</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        ZIEL: {weeklyGoal} TAGE / WOCHE
                    </span>

                    <button
                        onClick={handleToggle}
                        disabled={isPending}
                        className={`
                        w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 z-20 relative
                        ${isTogetherToday
                                ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] border border-rose-500"
                                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                            }
                    `}
                    >
                        {isTogetherToday ? (
                            <>Erledigt <Check size={16} strokeWidth={3} /></>
                        ) : (
                            <>+ Eintragen</>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}
