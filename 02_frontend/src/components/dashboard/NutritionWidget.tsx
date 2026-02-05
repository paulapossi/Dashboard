"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, Leaf, Minus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toggleNutritionHabit, undoNutritionHabit } from "@/actions/nutrition-actions";
import { useRouter } from "next/navigation";
import { calculateNutritionProgress, getCompletedCount } from "@/lib/progress-calculator";

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
        // Prevent event from bubbling to the Link (though structure prevents it now, safe to keep)
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
    
    const handleUndo = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;
        
        const reverseKeys: (keyof NutritionData)[] = ['sweets', 'water', 'vitamins', 'protein'];
        const lastKey = reverseKeys.find(key => data[key]);

        if (lastKey) {
            const newData = { ...data, [lastKey]: false };
            setData(newData);
            setIsPending(true);
            try {
                await undoNutritionHabit();
                router.refresh();
            } catch (error) {
                setData(data);
            } finally {
                setIsPending(false);
            }
        }
    };

    const completedCount = getCompletedCount(data);
    const DAILY_GOAL = 4;
    const progressPercent = calculateNutritionProgress(data);

    const getColorStatus = (count: number) => {
        if (count >= 4) return { stroke: "#10b981", shadow: "rgba(16,185,129,0.6)" };
        if (count === 3) return { stroke: "#34d399", shadow: "rgba(52,211,153,0.6)" };
        return { stroke: "#059669", shadow: "rgba(5,150,105,0.4)" };
    };

    const currentStyle = getColorStatus(completedCount);

    if (!mounted) return null;

    return (
        <div className="relative h-full w-full group cursor-pointer transition-colors duration-300">
            <Link href="/ernaehrung" className="absolute inset-0 z-10" />
            
            <div className="h-full w-full bg-gradient-to-br from-slate-900/60 to-emerald-900/20 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative z-20 overflow-hidden hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(168,185,129,0.2)] pointer-events-none">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">Ernährung</h3>
                        <p className="text-emerald-200/50 text-xs mt-0.5">Bio-Hacking Log</p>
                    </div>
                    <div className="text-emerald-500/20"><Leaf size={20} /></div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-2 gap-3">
                    <div className="text-4xl font-bold text-white">
                        {completedCount}/4
                    </div>
                    
                    {/* 4 Habits as checkboxes */}
                    <div className="flex flex-col gap-1.5 w-full px-3">
                        {orderedKeys.map((key, index) => {
                            const isComplete = data[key];
                            const labels = { protein: 'Protein', vitamins: 'Vitamine', water: 'Wasser', sweets: 'Keine Süßigkeiten' };
                            const icons = { protein: '🥩', vitamins: '🥦', water: '💧', sweets: '🚫' };
                            
                            return (
                                <motion.div
                                    key={key}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1, type: "spring" }}
                                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-300 ${
                                        isComplete 
                                            ? 'bg-emerald-500/20 border border-emerald-500/40' 
                                            : 'bg-slate-800/50 border border-slate-700'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                                        isComplete 
                                            ? 'bg-emerald-500 border-emerald-500' 
                                            : 'border-slate-600'
                                    }`}>
                                        {isComplete && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <span className="text-xs">{icons[key]}</span>
                                    <span className={`text-xs flex-1 ${
                                        isComplete ? 'text-emerald-300' : 'text-slate-400'
                                    }`}>
                                        {labels[key]}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <span className="text-xs text-slate-400">
                        {Math.round(progressPercent)}% Complete • Heute
                    </span>

                    <div className="flex w-full gap-2 relative z-20 pointer-events-auto">
                         <button
                            onClick={handleQuickAdd}
                            disabled={isPending}
                            className={`
                            flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95
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