"use client";

import { useState, useEffect } from "react";
import { Search, Bell, UserCircle, BookOpen, Clock, Plus, MoreHorizontal, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toggleReadingDay } from "@/actions/reading-actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ReadingData = {
    day1: boolean; day2: boolean; day3: boolean; day4: boolean; day5: boolean; day6: boolean; day7: boolean;
};

interface ReadingClientProps {
    initialData: ReadingData;
}

export default function ReadingClient({ initialData }: ReadingClientProps) {
    const router = useRouter();
    const [data, setData] = useState<ReadingData>(initialData);
    const [isPending, setIsPending] = useState(false);

    // Sync with server data
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleToggle = async (dayKey: keyof ReadingData) => {
        const newData = { ...data, [dayKey]: !data[dayKey] };
        setData(newData);

        setIsPending(true);
        try {
            await toggleReadingDay(dayKey);
            router.refresh();
        } catch (error) {
            console.error("Failed to toggle reading day:", error);
            setData(data); // Rollback
        } finally {
            setIsPending(false);
        }
    };

    // Tracker Minutes (Vorerst noch lokal, da kein DB Model dafür da ist - oder wir nutzen es einfach als UI state)
    const [todayMinutes, setTodayMinutes] = useState(0);
    const GOAL = 30;
    const progressPercent = Math.min((todayMinutes / GOAL) * 100, 100);

    const addMinutes = (min: number) => setTodayMinutes(prev => prev + min);

    const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    const dayKeys: (keyof ReadingData)[] = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto p-6 md:p-8 gap-8">
            {/* HEADER */}
            <header className="flex justify-between items-center relative z-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Lesen</h1>
                    <p className="text-slate-400 text-sm mt-1">Wochenübersicht & Tracker</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center bg-slate-800/50 px-4 py-2.5 rounded-full border border-slate-700 text-slate-400 w-64">
                        <Search size={18} className="mr-3" />
                        <span className="text-sm">Search...</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <Bell size={20} className="hover:text-white cursor-pointer" />
                        <UserCircle size={28} className="hover:text-white cursor-pointer" />
                    </div>
                </div>
            </header>

            {/* 1. WOCHENÜBERSICHT */}
            <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden z-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-200">Wochenübersicht</h2>
                    <MoreHorizontal className="text-slate-500 cursor-pointer hover:text-white" />
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4">
                    {weekDays.map((day, i) => {
                        const dayKey = dayKeys[i];
                        const hasRead = data[dayKey];

                        return (
                            <div key={day} className="flex flex-col items-center gap-3 group">
                                <span className="text-xs font-medium uppercase text-slate-500">{day}</span>
                                <div
                                    onClick={() => handleToggle(dayKey)}
                                    className={`
                                        w-full h-14 rounded-xl border flex items-center justify-center relative overflow-hidden transition-all cursor-pointer
                                        ${hasRead
                                            ? "bg-purple-600/30 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                            : "bg-slate-800/30 border-transparent hover:border-white/10"
                                        }
                                    `}
                                >
                                    {hasRead ? (
                                        <Check size={18} className="text-purple-400 relative z-10" />
                                    ) : (
                                        <BookOpen size={18} className="text-slate-600 relative z-10" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* BOTTOM GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full relative z-10">
                {/* LESELISTE */}
                <div className="bg-[#1e293b]/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col gap-6 shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-200">Leseliste</h3>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Plus size={20} className="text-slate-400" /></button>
                    </div>
                    {/* ... (Bücherliste hierhin kopieren aus der alten Page) ... */}
                    <p className="text-slate-500 text-sm">Aktuell keine Bücher in der Liste.</p>
                </div>

                {/* TRACKER */}
                <div className="bg-[#1e293b]/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-lg h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-200">Heutige Lesezeit</h3>
                        <Clock className="text-slate-500" size={20} />
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center gap-2 mb-8">
                        <div className="text-6xl font-bold text-white tracking-tighter">
                            {todayMinutes}<span className="text-2xl text-slate-500 font-normal ml-2">min</span>
                        </div>
                        <p className="text-slate-400 text-sm">Tagesziel: {GOAL} min</p>
                    </div>

                    <div className="mb-8 relative h-4 bg-slate-800 rounded-full overflow-visible">
                        <div className="absolute inset-0 rounded-full bg-slate-800 border border-white/5"></div>
                        <div
                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-400 to-white rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-700"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-slate-300 translate-x-1/2"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <button onClick={() => addMinutes(15)} className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 text-sm text-slate-300">+ 15 Min.</button>
                        <button onClick={() => addMinutes(30)} className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 text-sm text-slate-300">+ 30 Min.</button>
                        <button onClick={() => setTodayMinutes(prev => prev + 45)} className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 text-sm text-slate-300">{'>'} 30 Min.</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
