"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, Minus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toggleReadingDay, undoReadingDay } from "@/actions/reading-actions";
import { useRouter } from "next/navigation";

type ReadingData = {
    day1: boolean; day2: boolean; day3: boolean; day4: boolean; day5: boolean; day6: boolean; day7: boolean;
};

interface ReadingWidgetProps {
    initialData?: ReadingData;
}

export default function ReadingWidget({ initialData }: ReadingWidgetProps) {
    const router = useRouter();
    const [data, setData] = useState<ReadingData>(initialData || {
        day1: false, day2: false, day3: false, day4: false, day5: false, day6: false, day7: false
    });
    const [mounted, setMounted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const orderedKeys: (keyof ReadingData)[] = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync with server data
    useEffect(() => {
        if (initialData) {
            setData(initialData);
        }
    }, [initialData]);

    const handleQuickAdd = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        const nextKey = orderedKeys.find(key => !data[key]);

        if (nextKey) {
            // Optimistic Update
            const newData = { ...data, [nextKey]: true };
            setData(newData);

            setIsPending(true);
            try {
                await toggleReadingDay(nextKey);
                router.refresh();
            } catch (error) {
                console.error("Failed to toggle reading day:", error);
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
        
        // Find last active key
        const reverseKeys = [...orderedKeys].reverse();
        const lastKey = reverseKeys.find(key => data[key]);

        if (lastKey) {
             const newData = { ...data, [lastKey]: false };
             setData(newData);
             
             setIsPending(true);
             try {
                 await undoReadingDay();
                 router.refresh();
             } catch (error) {
                 setData(data);
             } finally {
                 setIsPending(false);
             }
        }
    };

    const completedCount = Object.values(data).filter(Boolean).length;
    const WEEKLY_GOAL = 7;
    const progressPercent = (completedCount / WEEKLY_GOAL) * 100;

    const getColorStatus = (count: number) => {
        if (count >= 7) return { stroke: "#a855f7", shadow: "rgba(168,85,247,0.6)" };
        if (count >= 4) return { stroke: "#eab308", shadow: "rgba(234,179,8,0.6)" };
        return { stroke: "#3b82f6", shadow: "rgba(59,130,246,0.6)" };
    };

    const currentStyle = getColorStatus(completedCount);

    if (!mounted) return null;

    return (
        <div className="relative h-full w-full group cursor-pointer transition-colors duration-300">
            <Link href="/lesen" className="absolute inset-0 z-10" />

            <div className="h-full w-full bg-gradient-to-br from-slate-900/60 to-purple-900/20 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative z-20 overflow-hidden hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] pointer-events-none">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Lesen</h3>
                        <p className="text-purple-200/50 text-xs mt-0.5">30 min • Täglich</p>
                    </div>
                    <div className="text-slate-500 text-xl">⋮</div>
                </div>

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

                <div className="flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        ZIEL: {completedCount} / {WEEKLY_GOAL} TAGE
                    </span>

                    <div className="flex w-full gap-2 relative z-20 pointer-events-auto">
                        <button
                            onClick={handleQuickAdd}
                            disabled={isPending}
                            className={`
                            flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95
                            ${completedCount >= WEEKLY_GOAL
                                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-500"
                                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                                }
                        `}
                        >
                            {completedCount >= WEEKLY_GOAL ? (
                                <>Erledigt <Check size={16} strokeWidth={3} /></>
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
