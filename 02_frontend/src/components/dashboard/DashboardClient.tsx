"use client";

import { useState, useEffect } from "react";
import RingCard from "@/components/dashboard/RingCard";

// WIDGET IMPORTS
import RelationshipWidget from "@/components/dashboard/RelationshipWidget";
import SportWidget from "@/components/dashboard/SportWidget";
import ReadingWidget from "@/components/dashboard/ReadingWidget";
import NutritionWidget from "@/components/dashboard/NutritionWidget";
import UniWidget from "@/components/dashboard/UniWidget";
import MentalWidget from "@/components/dashboard/MentalWidget";

import Sidebar from "@/components/Sidebar";
import { Search, Bell, UserCircle, Radar, ScanEye, Play, Pause, RotateCcw, Zap, Save } from "lucide-react";

// Types
type SportData = {
    gym1: boolean; gym2: boolean; run1: boolean; run2: boolean;
};
type ReadingData = {
    day1: boolean; day2: boolean; day3: boolean; day4: boolean; day5: boolean; day6: boolean; day7: boolean;
};
type NutritionData = {
    protein: boolean; vitamins: boolean; water: boolean; sweets: boolean;
};

interface DashboardClientProps {
    sportData?: SportData;
    readingData?: ReadingData;
    nutritionData?: NutritionData;
    relationshipData?: { isTogether: boolean; daysTogether: number; weeklyGoal: number };
}

// INITIAL DATEN
const initialCategories = [
    { id: "uni", label: "Uni", progress: 78, color: "indigo" },
    { id: "sport", label: "Sport", progress: 92, color: "teal" },
    { id: "lesen", label: "Lesen", progress: 95, color: "yellow" },
    { id: "food", label: "Ernährung", progress: 88, color: "green" },
    { id: "paula", label: "Paula", progress: 65, color: "red" },
    { id: "mental", label: "Mental", progress: 100, color: "purple" },
];

export default function DashboardClient({ sportData, readingData, nutritionData, relationshipData }: DashboardClientProps) {
    const [categories, setCategories] = useState(initialCategories);
    const [isLoaded, setIsLoaded] = useState(false);

    // FOCUS TIMER STATE
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [quickNote, setQuickNote] = useState("");

    // Timer Logik
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const toggleTimer = () => setTimerActive(!timerActive);
    const resetTimer = () => { setTimerActive(false); setTimeLeft(25 * 60); };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Quick Note speichern
    const saveNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickNote.trim()) return;
        const existing = JSON.parse(localStorage.getItem("brain-dump") || "[]");
        localStorage.setItem("brain-dump", JSON.stringify([...existing, { id: Date.now(), text: quickNote }]));
        setQuickNote("");
        alert("Gedanke im 'Mental'-Speicher abgelegt!");
    };

    const totalProgress = categories.reduce((acc, cat) => acc + cat.progress, 0);
    const averageScore = Math.round(totalProgress / categories.length);

    useEffect(() => {
        const savedData = localStorage.getItem("life-os-data");
        if (savedData) {
            try { setCategories(JSON.parse(savedData)); } catch (e) { console.error(e); }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem("life-os-data", JSON.stringify(categories));
    }, [categories, isLoaded]);

    const updateProgress = (id: string, amount: number) => {
        setCategories((prev) => prev.map((cat) => {
            if (cat.id === id) return { ...cat, progress: Math.max(0, Math.min(100, cat.progress + amount)) };
            return cat;
        }));
    };

    if (!isLoaded) return null;

    return (
        <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans selection:bg-blue-500/30">
            <div className="relative z-50 h-full flex-shrink-0"><Sidebar /></div>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto px-6 py-8 gap-8">

                <header className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                        <p className="text-slate-400 text-sm mt-1">Life OS • System Overview</p>
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

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* HERO CARD */}
                    <div className="xl:col-span-1 bg-gradient-to-br from-slate-900 via-[#0f1115] to-blue-950/20 rounded-[32px] p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[300px] h-full shadow-2xl group">
                        <div className="relative z-20 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Radar className="text-blue-400 animate-pulse" /> System Status
                                </h2>
                                <p className="text-blue-200/50 text-sm mt-1">Gesamtfortschritt & Balance</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${averageScore >= 80 ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'}`}>
                                {averageScore >= 80 ? 'OPTIMAL' : 'AUSBALANCIEREN'}
                            </div>
                        </div>
                        <div className="relative z-10 flex-1 flex items-center justify-center my-4">
                            <div className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(59,130,246,0.1)_360deg)] animate-[spin_4s_linear_infinite] rounded-full -top-1/2 -left-1/2 opacity-50 pointer-events-none"></div>
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="48" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.5" />
                                    <circle cx="50" cy="50" r="36" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.5" />
                                    <circle cx="50" cy="50" r="24" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.5" />
                                </svg>
                                <div className="relative z-20 flex flex-col items-center justify-center bg-[#0f1115] w-24 h-24 rounded-full border-2 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                    <span className="text-3xl font-black text-white">{averageScore}%</span>
                                    <span className="text-[10px] text-blue-400 tracking-widest uppercase">Score</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 relative z-20 bg-slate-800/30 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 animate-[pulse_2s_infinite]">
                                <ScanEye size={20} />
                            </div>
                            <div className="text-xs text-slate-400 flex-1">
                                <div className="font-bold text-white mb-0.5">AI Watchtower</div>
                                System scan active.
                            </div>
                        </div>
                    </div>

                    {/* WIDGET GRID */}
                    <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => {
                            const wrapperClass = "h-[320px] w-full";
                            if (cat.id === "uni") return <div key={cat.id} className={wrapperClass}><UniWidget /></div>;
                            if (cat.id === "paula") return <div key={cat.id} className={wrapperClass}><RelationshipWidget initialData={relationshipData} /></div>;
                            if (cat.id === "sport") return <div key={cat.id} className={wrapperClass}><SportWidget initialData={sportData} /></div>;
                            if (cat.id === "lesen") return <div key={cat.id} className={wrapperClass}><ReadingWidget initialData={readingData} /></div>;
                            
                            // NUTRITION WIDGET MIT SERVER DATEN
                            if (cat.id === "food") return <div key={cat.id} className={wrapperClass}><NutritionWidget initialData={nutritionData} /></div>;
                            
                            if (cat.id === "mental") return <div key={cat.id} className={wrapperClass}><MentalWidget /></div>;

                            return (
                                <div key={cat.id} className={wrapperClass}>
                                    <RingCard id={cat.id} label={cat.label} progress={cat.progress} color={cat.color} onUpdate={(amount) => updateProgress(cat.id, amount)} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* NEURAL FLOW BAR */}
                <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-[24px] p-6 border border-white/10 flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${timerActive ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-blue-500 bg-blue-500/10 text-blue-400'}`}>
                            <Zap size={28} className={timerActive ? "animate-pulse" : ""} />
                        </div>
                        <div>
                            <div className="text-3xl font-black font-mono text-white tracking-widest">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button onClick={toggleTimer} className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1">
                                    {timerActive ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Start Focus</>}
                                </button>
                                <button onClick={resetTimer} className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white flex items-center gap-1">
                                    <RotateCcw size={12} /> Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative">
                        <form onSubmit={saveNote} className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={quickNote}
                                    onChange={(e) => setQuickNote(e.target.value)}
                                    placeholder="Quick Capture: Was beschäftigt dich gerade?"
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-4 pl-5 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                            <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl border border-white/5 transition-all">
                                <Save size={20} />
                            </button>
                        </form>
                    </div>
                </div>

            </main>
        </div>
    );
}
