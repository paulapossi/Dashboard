"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, Bell, UserCircle, Heart, Calendar, Save, Check, History, Plus } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Typ für einen Log-Eintrag
type CheckInLog = {
    id: number;
    date: string;
    fullDate: string;
    qt: boolean;
    comm: boolean;
    text: string;
};

export default function PaulaPage() {
    // --- STATE: BEZIEHUNGS-TIMER ---
    const START_DATE = new Date(2025, 5, 15); // 15. Juni 2025
    const [timeTogether, setTimeTogether] = useState({ months: 0, days: 0 });
    const [isFuture, setIsFuture] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            let diff = now.getTime() - START_DATE.getTime();
            if (diff < 0) {
                setIsFuture(true);
                setTimeTogether({ months: 0, days: 0 });
                return;
            } else {
                setIsFuture(false);
            }
            const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
            const months = Math.floor(totalDays / 30.44);
            const days = Math.floor(totalDays % 30.44);
            setTimeTogether({ months, days });
        };
        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // --- STATE: WOCHEN ZIEL (MIT SYNC LOGIK) ---
    const [isTogetherToday, setIsTogetherToday] = useState(false);

    // 1. Beim Laden prüfen
    useEffect(() => {
        const saved = localStorage.getItem("paula-today");
        if (saved === "true") setIsTogetherToday(true);
    }, []);

    // 2. Button Funktion
    const toggleTogether = () => {
        const newState = !isTogetherToday;
        setIsTogetherToday(newState);
        localStorage.setItem("paula-today", newState.toString());
    };

    const baseDays = 2;
    const daysTogether = isTogetherToday ? baseDays + 1 : baseDays;
    const weeklyGoal = 4;
    const progressPercent = Math.min((daysTogether / weeklyGoal) * 100, 100);

    const getColorStatus = (days: number) => {
        if (days >= 4) return { stroke: "#e11d48", shadow: "rgba(225,29,72,0.6)", label: "Ziel erreicht" };
        if (days === 3) return { stroke: "#f472b6", shadow: "rgba(244,114,182,0.6)", label: "Fast da" };
        if (days === 2) return { stroke: "#facc15", shadow: "rgba(250,204,21,0.6)", label: "Geht so" };
        return { stroke: "#94a3b8", shadow: "rgba(148,163,184,0.4)", label: "Zu wenig" };
    };
    const currentColor = getColorStatus(daysTogether);

    // --- STATE: CHECK-IN & HISTORIE ---
    const [history, setHistory] = useState<CheckInLog[]>([
        { id: 1, date: "18. Dez", fullDate: "18.12.2025", qt: true, comm: true, text: "Dass du mir beim Kochen geholfen hast, obwohl du müde warst." },
        { id: 2, date: "17. Dez", fullDate: "17.12.2025", qt: false, comm: true, text: "Für das ehrliche Gespräch über unsere Urlaubsplanung." },
        { id: 3, date: "16. Dez", fullDate: "16.12.2025", qt: true, comm: true, text: "Dass wir so viel zusammen gelacht haben." },
    ]);

    const [qualityTime, setQualityTime] = useState<boolean | null>(null);
    const [communication, setCommunication] = useState<boolean | null>(null);
    const [gratitude, setGratitude] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [selectedLog, setSelectedLog] = useState<CheckInLog | null>(null);

    const handleSave = () => {
        if (qualityTime === null || communication === null || !gratitude.trim()) return;
        setIsSaved(true);
        const newEntry: CheckInLog = {
            id: Date.now(),
            date: "Heute",
            fullDate: new Date().toLocaleDateString(),
            qt: qualityTime,
            comm: communication,
            text: gratitude
        };
        setTimeout(() => {
            setIsSaved(false);
            setHistory([newEntry, ...history]);
            setQualityTime(null);
            setCommunication(null);
            setGratitude("");
        }, 1500);
    };

    return (
        <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans selection:bg-rose-500/30">

            {/* SIDEBAR WRAPPER (z-50 sorgt dafür, dass sie IMMER oben liegt) */}
            <div className="relative z-50 h-full flex-shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto p-6 md:p-8 gap-8">

                {/* BACKGROUND (Hinter dem Inhalt) */}
                <div className="fixed top-0 left-0 right-0 h-full pointer-events-none overflow-hidden z-0 bg-[#0f1115]">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 via-[#0f1115] to-[#0f1115] opacity-70"></div>
                    <div className="absolute top-[-15%] right-[-20%] w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[130px] mix-blend-screen"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-700/15 rounded-full blur-[100px] mix-blend-screen"></div>
                    <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[80px] mix-blend-screen opacity-60"></div>
                    <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-rose-900/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
                </div>

                {/* HEADER */}
                <header className="flex justify-between items-center relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            Beziehung <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={24} />
                        </h1>
                        <p className="text-rose-200/60 text-sm mt-1">Paula & Ich</p>
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

                {/* GRID (z-10 damit er über dem Hintergrund liegt) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">

                    {/* LINKE SPALTE */}
                    <div className="flex flex-col gap-8">
                        {/* Timer Card */}
                        <div className="relative h-[300px] rounded-[32px] overflow-hidden group shadow-2xl border border-white/10">
                            <Image src="/couple.jpeg" alt="Couple" fill className="object-cover object-[50%_25%] transition-transform duration-1000 group-hover:scale-105" priority />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <p className="text-rose-200 text-sm font-medium mb-1">
                                    {isFuture ? "Bald geht es los..." : "Wir sind zusammen seit..."}
                                </p>
                                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg text-nowrap">
                                    {timeTogether.months} Monate, {timeTogether.days} Tage
                                </h2>
                                <p className="text-white/60 text-xs mt-4">Startschuss am 15.06.2025!</p>
                            </div>
                        </div>

                        {/* Wochen Ziel Card */}
                        <div className="bg-gradient-to-br from-slate-900/60 to-rose-900/20 backdrop-blur-md border border-white/10 rounded-[32px] p-8 flex flex-col justify-between shadow-lg min-h-[300px]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Gemeinsame Zeit</h3>
                                    <p className="text-rose-200/50 text-sm">Diese Woche</p>
                                </div>
                                <div className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs border border-rose-500/20">Woche 51</div>
                            </div>
                            <div className="flex items-center gap-8 mt-6">
                                <div className="relative w-40 h-40 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="#334155" strokeWidth="12" fill="transparent" opacity="0.5" />
                                        <motion.circle
                                            cx="80" cy="80" r="70" stroke={currentColor.stroke} strokeWidth="12" fill="transparent" strokeLinecap="round"
                                            strokeDasharray="440" animate={{ strokeDashoffset: 440 - (440 * progressPercent / 100) }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            style={{ filter: `drop-shadow(0 0 10px ${currentColor.shadow})` }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-white">{daysTogether} <span className="text-lg text-slate-400">/ {weeklyGoal}</span></span>
                                        <span className="text-xs text-rose-300">Tage</span>
                                    </div>
                                </div>
                                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex-1">
                                    <p className="text-sm text-rose-100 font-medium">💡 Status:</p>
                                    <p className="text-xs text-rose-200/70 mt-1">{currentColor.label}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                                <span className="text-xs text-rose-200/50 font-medium tracking-wide">ZIEL: {weeklyGoal} TAGE</span>

                                {/* WICHTIG: onClick Ruft jetzt toggleTogether auf (Sync) */}
                                <button onClick={toggleTogether} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 ${isTogetherToday ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] border border-rose-500" : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-rose-500/50 hover:text-rose-300 hover:bg-slate-800/80"}`}>
                                    {isTogetherToday ? <>Heute zusammen <Check size={16} strokeWidth={3} /></> : <>Heute eintragen <span className="opacity-50">+</span></>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RECHTE SPALTE (Check-In & Historie) */}
                    <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 flex flex-col justify-between shadow-2xl h-full min-h-[500px]">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedLog ? "Rückblick" : "Beziehungs-Check-in"}</h3>
                                {selectedLog && <p className="text-rose-400 text-sm mt-1">{selectedLog.fullDate}</p>}
                            </div>
                            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg"><Calendar size={20} /></div>
                        </div>

                        {/* FORMULAR ODER HISTORIE ANZEIGE */}
                        <div className="flex-1 flex flex-col gap-6">
                            <AnimatePresence mode="wait">
                                {selectedLog ? (
                                    <motion.div key="history-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col gap-6">
                                        <div className="space-y-2">
                                            <label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Qualitätszeit</label>
                                            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${selectedLog.qt ? 'bg-rose-900/20 border-rose-500/30 text-rose-200' : 'bg-slate-800/50 border-white/5 text-slate-400'}`}>
                                                {selectedLog.qt ? <Check size={18} /> : <div className="w-4" />}
                                                {selectedLog.qt ? "Ja, wir hatten Zeit." : "Nein, leider nicht."}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Kommunikation</label>
                                            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${selectedLog.comm ? 'bg-rose-900/20 border-rose-500/30 text-rose-200' : 'bg-slate-800/50 border-white/5 text-slate-400'}`}>
                                                {selectedLog.comm ? <Check size={18} /> : <div className="w-4" />}
                                                {selectedLog.comm ? "Ja, wir waren ehrlich." : "Nein, es gab Schwierigkeiten."}
                                            </div>
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Dankbarkeit</label>
                                            <div className="w-full h-full min-h-[120px] bg-slate-800/30 border border-white/5 rounded-2xl p-5 text-rose-100 italic relative">
                                                <div className="absolute top-2 left-2 text-rose-500/20 text-4xl font-serif">"</div>
                                                {selectedLog.text}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="input-view" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex flex-col gap-6">
                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium ml-1">Hattet ihr heute Qualitätszeit?</label>
                                            <div className="flex gap-4">
                                                <button onClick={() => setQualityTime(true)} className={`flex-1 py-4 rounded-2xl border transition-all font-bold text-sm ${qualityTime === true ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700/50'}`}>Ja</button>
                                                <button onClick={() => setQualityTime(false)} className={`flex-1 py-4 rounded-2xl border transition-all font-bold text-sm ${qualityTime === false ? 'bg-slate-600 border-slate-500 text-white' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700/50'}`}>Nein</button>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-slate-300 text-sm font-medium ml-1">War die Kommunikation ehrlich?</label>
                                            <div className="flex gap-4">
                                                <button onClick={() => setCommunication(true)} className={`flex-1 py-4 rounded-2xl border transition-all font-bold text-sm ${communication === true ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700/50'}`}>Ja</button>
                                                <button onClick={() => setCommunication(false)} className={`flex-1 py-4 rounded-2xl border transition-all font-bold text-sm ${communication === false ? 'bg-slate-600 border-slate-500 text-white' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700/50'}`}>Nein</button>
                                            </div>
                                        </div>
                                        <div className="space-y-3 flex-1 flex flex-col">
                                            <label className="text-slate-300 text-sm font-medium ml-1">Dankbarkeit (1 Satz)</label>
                                            <textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="Ich bin dankbar für..." className="flex-1 w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all resize-none placeholder:text-slate-600" />
                                        </div>
                                        <button onClick={handleSave} disabled={isSaved} className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isSaved ? "bg-green-500 text-white" : "bg-white text-rose-900 hover:bg-rose-50"}`}>
                                            {isSaved ? <Check size={20} /> : <Save size={20} />}
                                            {isSaved ? "Gespeichert!" : "Check-in Speichern"}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* FOOTER: HISTORY BUBBLES */}
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <p className="text-xs text-slate-500 mb-3 ml-1 font-bold uppercase tracking-wider">Verlauf</p>
                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                <button onClick={() => setSelectedLog(null)} className={`flex-shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-all ${selectedLog === null ? "bg-rose-500 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)] scale-110" : "bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
                                    <Plus size={20} />
                                </button>
                                {history.map((log) => (
                                    <button key={log.id} onClick={() => setSelectedLog(log)} className={`flex-shrink-0 w-12 h-12 rounded-full border flex flex-col items-center justify-center transition-all ${selectedLog?.id === log.id ? "bg-white text-rose-900 border-white shadow-lg scale-110" : "bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
                                        <span className="text-[9px] uppercase font-bold opacity-60 leading-none">{log.date.split('. ')[1]}</span>
                                        <span className="text-sm font-bold leading-none">{log.date.split('. ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* UNTEN: HISTORIE (Letzte Wochen) */}
                <div className="relative z-10 w-full bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-[32px] p-6 md:p-8 shadow-2xl mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><History size={20} /></div>
                        <h3 className="text-xl font-bold text-white">Verlauf der letzten Wochen</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[{ week: 50, days: 4, goal: 4 }, { week: 49, days: 4, goal: 4 }, { week: 48, days: 4, goal: 4 }].map((week, i) => (
                            <div key={i} className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-colors group">
                                <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700/50 rounded-xl text-slate-300 font-bold border border-white/5">
                                    <span className="text-[10px] uppercase text-slate-500">KW</span>
                                    <span className="text-lg leading-none">{week.week}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm text-slate-300 font-medium">Gemeinsame Zeit</span>
                                        <span className="text-xs font-bold text-rose-400">{week.days} / {week.goal} Tage</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full w-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.4)]"></div>
                                    </div>
                                </div>
                                <div className="p-1.5 bg-green-500/20 rounded-full text-green-400 border border-green-500/30"><Check size={14} strokeWidth={3} /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}