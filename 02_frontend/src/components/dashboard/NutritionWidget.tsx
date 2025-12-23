"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toggleNutritionHabit } from "@/actions/nutrition-actions";
import { useRouter } from "next/navigation";

type NutritionData = {
    protein: boolean;
    vitamins: boolean;
    water: boolean;
    sweets: boolean;
};

interface NutritionWidgetProps {
    initialData?: NutritionData;
}

export default function NutritionWidget({ initialData }: NutritionWidgetProps) {
    const router = useRouter();
    const [data, setData] = useState<NutritionData>(initialData || {
        protein: false, vitamins: false, water: false, sweets: false
    });
    const [mounted, setMounted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const orderedKeys: (keyof NutritionData)[] = ['protein', 'vitamins', 'water', 'sweets'];

    useEffect(() => {
        setMounted(true);
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
            const newData = { ...data, [nextKey]: true };
            setData(newData);
            // Optimistic update - no localStorage anymore

            setIsPending(true);
            try {
                await toggleNutritionHabit(nextKey);
                router.refresh();
            } catch (error) {
                console.error("Failed to toggle nutrition habit:", error);
                // Rollback could be handled here if needed, but router.refresh usually fixes state
            } finally {
                setIsPending(false);
            }
        }
    };

    const completedCount = Object.values(data).filter(Boolean).length;
    const DAILY_GOAL = 4;
    const progressPercent = (completedCount / DAILY_GOAL) * 100;

    const getColorStatus = (count: number) => {
        if (count >= 4) return { stroke: "#10b981", shadow: "rgba(16,185,129,0.6)" };
        if (count === 3) return { stroke: "#34d399", shadow: "rgba(52,211,153,0.6)" };
        return { stroke: "#059669", shadow: "rgba(5,150,105,0.4)" };
    };

    const currentStyle = getColorStatus(completedCount);

    if (!mounted) return null;

    return (
        <Link href="/ernaehrung" className="block h-full w-full">
            <div className="h-full w-full bg-gradient-to-br from-slate-900/60 to-emerald-900/20 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,185,129,0.2)] transition-transform duration-300 will-change-transform cursor-pointer">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">Ernährung</h3>
                        <p className="text-emerald-200/50 text-xs mt-0.5">Bio-Hacking Log</p>
                    </div>
                    <div className="text-emerald-500/20"><Leaf size={20} /></div>
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
                        HEUTE: {completedCount} / {DAILY_GOAL}
                    </span>

                    <button
                        onClick={handleQuickAdd}
                        disabled={isPending}
                        className={`
                        w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 z-20 relative
                        ${completedCount >= DAILY_GOAL
                                ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-500"
                                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                            }
                    `}
                    >
                        {completedCount >= DAILY_GOAL ? (
                            <>Complete <Check size={16} strokeWidth={3} /></>
                        ) : (
                            <>+ Check</>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}
