"use client";

import { useState, useEffect } from "react";
import { Search, Bell, UserCircle, Heart, Calendar, Save, Check, History, Plus, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toggleTogether, saveCheckIn } from "@/actions/relationship-actions";
import { useRouter } from "next/navigation";

type RelationshipData = {
    isTogether: boolean;
    qualityTime: boolean;
    communication: boolean;
    gratitude: string | null;
};

type HistoryEntry = {
    id: string;
    date: Date;
    isTogether: boolean;
    qualityTime: boolean;
    communication: boolean;
    gratitude: string | null;
};

interface PaulaClientProps {
    todayData: RelationshipData;
    history: HistoryEntry[];
    weeklyStats: { daysTogether: number; weeklyGoal: number };
}

export default function PaulaClient({ todayData, history, weeklyStats }: PaulaClientProps) {
    const router = useRouter();
    const START_DATE = new Date(2025, 5, 15); // 15. Juni 2025
    
    const [timeTogether, setTimeTogether] = useState({ months: 0, days: 0 });
    const [isFuture, setIsFuture] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [selectedLog, setSelectedLog] = useState<HistoryEntry | null>(null);

    // Local form state
    const [qualityTime, setQualityTime] = useState<boolean>(todayData.qualityTime);
    const [communication, setCommunication] = useState<boolean>(todayData.communication);
    const [gratitude, setGratitude] = useState(todayData.gratitude || "");
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            let diff = now.getTime() - START_DATE.getTime();
            if (diff < 0) {
                setIsFuture(true);
                setTimeTogether({ months: 0, days: 0 });
            } else {
                setIsFuture(false);
                const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
                const months = Math.floor(totalDays / 30.44);
                const days = Math.floor(totalDays % 30.44);
                setTimeTogether({ months, days });
            }
        };
        calculateTime();
        const timer = setInterval(calculateTime, 1000 * 60 * 60); // Update hourly
        return () => clearInterval(timer);
    }, []);

    const handleToggleTogether = async () => {
        setIsPending(true);
        try {
            await toggleTogether();
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    const handleSaveCheckIn = async () => {
        if (!gratitude.trim()) return;
        setIsPending(true);
        try {
            await saveCheckIn({ qualityTime, communication, gratitude });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    const progressPercent = Math.min((weeklyStats.daysTogether / weeklyStats.weeklyGoal) * 100, 100);

    const getColorStatus = (days: number) => {
        if (days >= 4) return { stroke: "#e11d48", shadow: "rgba(225,29,72,0.6)", label: "Ziel erreicht ❤️" };
        if (days === 3) return { stroke: "#f472b6", shadow: "rgba(244,114,182,0.6)", label: "Fast da" };
        return { stroke: "#94a3b8", shadow: "rgba(148,163,184,0.4)", label: "Geht so" };
    };
    const currentColor = getColorStatus(weeklyStats.daysTogether);

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto p-6 md:p-8 gap-8">
            <header className="flex justify-between items-center relative z-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        Relationship <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={24} />
                    </h1>
                    <p className="text-rose-200/60 text-sm mt-1">Paula & Ich • Shared Life</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center bg-slate-800/50 px-4 py-2.5 rounded-full border border-slate-700 text-slate-400 w-64 hover:border-rose-500/30 transition-all">
                        <Search size={18} className="mr-3" />
                        <span className="text-sm">Search Moments...</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <div className="p-2 hover:bg-slate-800 rounded-full hover:text-white transition-all cursor-pointer"><Bell size={20} /></div>
                        <div className="p-2 hover:bg-slate-800 rounded-full hover:text-white transition-all cursor-pointer"><UserCircle size={28} /></div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
                {/* LINKE SPALTE */}
                <div className="flex flex-col gap-8">
                    {/* Timer Card */}
                    <div className="relative h-[300px] rounded-[32px] overflow-hidden group shadow-2xl border border-white/10">
                        <Image src="/couple.jpeg" alt="Couple" fill className="object-cover object-[50%_25%] transition-transform duration-1000 group-hover:scale-105" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                <p className="text-rose-200 text-sm font-bold uppercase tracking-widest">
                                    {isFuture ? "The Beginning" : "Our Journey"}
                                </p>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-2xl">
                                {timeTogether.months} <span className="text-xl font-medium text-rose-300">Months</span>, {timeTogether.days} <span className="text-xl font-medium text-rose-300">Days</span>
                            </h2>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/80 text-xs font-bold">
                                    Est. June 15, 2025
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wochen Ziel Card */}
                    <div className="bg-gradient-to-br from-slate-900/60 to-rose-900/20 backdrop-blur-md border border-white/10 rounded-[32px] p-8 flex flex-col justify-between shadow-lg min-h-[300px] hover:border-rose-500/20 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Calendar className="text-rose-400" size={20} /> Together Time
                                </h3>
                                <p className="text-rose-200/50 text-sm">Weekly Progress Tracker</p>
                            </div>
                            <div className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-500/20 uppercase tracking-widest">
                                Goal: {weeklyStats.weeklyGoal} Days
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-10 mt-6">
                            <div className="relative w-40 h-40 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="72" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                                    <motion.circle
                                        cx="80" cy="80" r="72" stroke={currentColor.stroke} strokeWidth="12" fill="transparent" strokeLinecap="round"
                                        strokeDasharray="452" animate={{ strokeDashoffset: 452 - (452 * progressPercent / 100) }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                        style={{ filter: `drop-shadow(0 0 12px ${currentColor.shadow})` }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-white">{weeklyStats.daysTogether}</span>
                                    <span className="text-[10px] text-rose-300 font-bold uppercase tracking-tighter">Days / Week</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full -mr-8 -mt-8"></div>
                                    <p className="text-xs text-rose-300 font-bold uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-lg text-white font-bold">{currentColor.label}</p>
                                </div>
                                <button 
                                    onClick={handleToggleTogether} 
                                    disabled={isPending}
                                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg ${todayData.isTogether ? "bg-rose-600 text-white shadow-rose-600/30" : "bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700 hover:text-white"}`}
                                >
                                    {todayData.isTogether ? <><Check size={18} strokeWidth={4} /> Day Logged</> : <><Plus size={18} /> Log Today</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECHTE SPALTE (Check-In & Historie) */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 flex flex-col shadow-2xl h-full min-h-[600px] hover:border-rose-500/10 transition-all">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                {selectedLog ? "Moment Review" : "Daily Check-in"}
                                <MessageCircle className="text-rose-400" size={24} />
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">{selectedLog ? new Date(selectedLog.date).toLocaleDateString() : "Reflect on your day together"}</p>
                        </div>
                        {selectedLog && (
                            <button onClick={() => setSelectedLog(null)} className="p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-rose-500 hover:text-white transition-all">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col gap-8">
                        <AnimatePresence mode="wait">
                            {selectedLog ? (
                                <motion.div key="history-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`p-6 rounded-3xl border ${selectedLog.qualityTime ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-800/30 border-white/5 opacity-50'}`}>
                                            <Heart className={selectedLog.qualityTime ? 'text-rose-400 fill-rose-400' : 'text-slate-600'} size={24} />
                                            <p className="mt-4 font-bold text-white">Quality Time</p>
                                            <p className="text-xs text-slate-500 mt-1">{selectedLog.qualityTime ? 'Shared Moments' : 'No time'}</p>
                                        </div>
                                        <div className={`p-6 rounded-3xl border ${selectedLog.communication ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-800/30 border-white/5 opacity-50'}`}>
                                            <MessageCircle className={selectedLog.communication ? 'text-rose-400 fill-rose-400' : 'text-slate-600'} size={24} />
                                            <p className="mt-4 font-bold text-white">Communication</p>
                                            <p className="text-xs text-slate-500 mt-1">{selectedLog.communication ? 'Deep Talk' : 'Surface level'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/30 border border-white/5 rounded-[32px] p-8 relative">
                                        <div className="absolute top-4 left-4 text-rose-500/10 text-6xl font-serif">"</div>
                                        <p className="text-lg text-rose-100 italic leading-relaxed relative z-10">
                                            {selectedLog.gratitude || "No note saved."}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="input-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col gap-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <button onClick={() => setQualityTime(!qualityTime)} className={`group p-6 rounded-[24px] border transition-all text-left relative overflow-hidden ${qualityTime ? 'bg-rose-500 border-rose-500 shadow-xl' : 'bg-slate-800/50 border-white/5 hover:border-rose-500/30'}`}>
                                            <Heart className={`transition-colors ${qualityTime ? 'text-white fill-white' : 'text-rose-500 group-hover:scale-110'}`} size={24} />
                                            <p className={`mt-4 font-bold uppercase tracking-wider text-xs ${qualityTime ? 'text-white' : 'text-slate-400'}`}>Quality Time</p>
                                        </button>
                                        <button onClick={() => setCommunication(!communication)} className={`group p-6 rounded-[24px] border transition-all text-left relative overflow-hidden ${communication ? 'bg-rose-500 border-rose-500 shadow-xl' : 'bg-slate-800/50 border-white/5 hover:border-rose-500/30'}`}>
                                            <MessageCircle className={`transition-colors ${communication ? 'text-white fill-white' : 'text-rose-500 group-hover:scale-110'}`} size={24} />
                                            <p className={`mt-4 font-bold uppercase tracking-wider text-xs ${communication ? 'text-white' : 'text-slate-400'}`}>Communication</p>
                                        </button>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-4">
                                        <label className="text-slate-400 text-xs font-black uppercase tracking-widest ml-1">Daily Gratitude Moment</label>
                                        <textarea 
                                            value={gratitude} 
                                            onChange={(e) => setGratitude(e.target.value)} 
                                            placeholder="What made you smile about Paula today?" 
                                            className="flex-1 w-full bg-slate-800/50 border border-white/10 rounded-[24px] p-6 text-white text-base focus:outline-none focus:border-rose-500/50 transition-all resize-none placeholder:text-slate-600 leading-relaxed shadow-inner" 
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSaveCheckIn} 
                                        disabled={isPending || isSaved || !gratitude.trim()} 
                                        className={`w-full py-5 rounded-[24px] font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${isSaved ? "bg-emerald-500 text-white" : "bg-white text-rose-950 hover:bg-rose-50 disabled:opacity-50"}`}
                                    >
                                        {isSaved ? <><Check size={24} strokeWidth={4} /> Saved!</> : <><Save size={24} /> Complete Reflection</>}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* HISTORY BUBBLES */}
                    <div className="mt-10 pt-8 border-t border-white/5">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Recent History</span>
                            <History size={14} className="text-slate-600" />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            <button onClick={() => setSelectedLog(null)} className={`flex-shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${selectedLog === null ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/30 scale-105" : "bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-700"}`}>
                                <Plus size={24} />
                            </button>
                            {history.map((log) => {
                                const d = new Date(log.date);
                                return (
                                    <button 
                                        key={log.id} 
                                        onClick={() => setSelectedLog(log)} 
                                        className={`flex-shrink-0 w-14 h-14 rounded-2xl border flex flex-col items-center justify-center transition-all relative ${selectedLog?.id === log.id ? "bg-white text-rose-950 border-white shadow-xl scale-105" : "bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800"}`}
                                    >
                                        <span className="text-[9px] uppercase font-black opacity-60">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-lg font-black">{d.getDate()}</span>
                                        {log.qualityTime && <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#0f1115]"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
