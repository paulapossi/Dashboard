"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [daysTogether, setDaysTogether] = useState(initialData?.daysTogether ?? 0);
    const weeklyGoal = 7; // Fixed to 7 for weekly heart display

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync with server data when it changes
    useEffect(() => {
        if (initialData) {
            setDaysTogether(initialData.daysTogether);
        }
    }, [initialData]);

    const handleCardClick = () => {
        router.push("/paula");
    };

    const handleToggle = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        setIsPending(true);
        try {
            await toggleTogether();
            router.refresh();
        } catch (error) {
            console.error("Failed to toggle relationship status:", error);
        } finally {
            setIsPending(false);
        }
    };

    const progressPercent = Math.round((daysTogether / weeklyGoal) * 100);

    if (!mounted) return null;

    return (
        <div 
            onClick={handleCardClick}
            className="h-full w-full bg-gradient-to-br from-slate-900/60 to-rose-900/20 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300 cursor-pointer border border-white/5"
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">Paula</h3>
                    <p className="text-rose-200/50 text-xs mt-0.5">Gemeinsame Zeit</p>
                </div>
                <div className="text-rose-500/30">
                    <Heart size={20} fill="currentColor" />
                </div>
            </div>

            {/* Main Content - 7 Hearts */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 py-4">
                {/* Big Number */}
                <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-1">{daysTogether}</div>
                    <div className="text-xs text-rose-200/60 uppercase tracking-wider">Tage zusammen</div>
                </div>

                {/* 7 Hearts Grid */}
                <div className="flex gap-3 flex-wrap justify-center">
                    {Array.from({ length: 7 }).map((_, index) => {
                        const isFilled = index < daysTogether;
                        return (
                            <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                                className="relative"
                            >
                                <Heart
                                    size={28}
                                    className={`transition-all duration-300 ${
                                        isFilled
                                            ? "text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                                            : "text-slate-700 fill-slate-800"
                                    }`}
                                    strokeWidth={1.5}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Progress Indicator */}
                <div className="text-xs text-slate-400 font-medium">
                    {progressPercent}% Complete • {7 - daysTogether} verbleibend
                </div>
            </div>

            {/* Quick Action Button */}
            <button
                onClick={handleToggle}
                disabled={isPending}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 hover:border-rose-500/50 disabled:opacity-50 relative z-10"
            >
                {isPending ? "Laden..." : "+ Heute zusammen"}
            </button>
        </div>
    );
}
