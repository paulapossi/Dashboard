"use client";

import { useState, useRef } from "react";
import { Search, Bell, UserCircle, Brain, Sparkles, Clock, Trash2, Plus, Smile, Meh, Frown, Cloud, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateMeTime, createBrainDump, processBrainDumpItem, addJournalEntry, deleteJournalEntry } from "@/actions/mental-actions";
import { useRouter } from "next/navigation";

// Types
type JournalEntry = {
    id: string;
    content: string;
    mood: string;
    createdAt: Date;
};

type BrainDumpItem = {
    id: string;
    content: string;
    createdAt: Date;
};

interface MentalClientProps {
    meTimeHours: number;
    journalEntries: JournalEntry[];
    brainDumpItems: BrainDumpItem[];
    weekNumber: number;
    year: number;
}

export default function MentalClient({ meTimeHours, journalEntries, brainDumpItems, weekNumber }: MentalClientProps) {
    const router = useRouter();
    const [selectedMood, setSelectedMood] = useState<"Good" | "Neutral" | "Bad">("Good");
    const [isPending, setIsPending] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const WEEKLY_GOAL = 5;
    const progressPercent = Math.min((meTimeHours / WEEKLY_GOAL) * 100, 100);

    // --- ACTIONS ---

    const handleUpdateTime = async (delta: number) => {
        // Optimistic UI könnte man machen, aber bei DB Calls reicht oft kurzes Warten
        // Wir machen hier kein komplexes Optimistic State Management, sondern verlassen uns auf Server Refresh
        // da es sonst komplex wird mit dem Sync.
        try {
            await updateMeTime(delta);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddJournal = async (formData: FormData) => {
        setIsPending(true);
        formData.append("mood", selectedMood); // Mood manuell hinzufügen
        try {
            await addJournalEntry(formData);
            formRef.current?.reset();
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    const handleDeleteJournal = async (id: string) => {
        if(!confirm("Eintrag wirklich löschen?")) return;
        try {
            await deleteJournalEntry(id);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    const handleProcessBrainDump = async (id: string) => {
        try {
            await processBrainDumpItem(id);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto p-6 md:p-8 gap-8">
            {/* HEADER */}
            <header className="flex justify-between items-center relative z-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        Mental & Reflection <Brain className="text-purple-400" size={28} />
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Clarity of Mind • KW {weekNumber}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center bg-slate-800/50 px-4 py-2.5 rounded-full border border-slate-700 text-slate-400 w-64 hover:border-purple-500/50 hover:bg-slate-800 transition-all cursor-text group">
                        <Search size={18} className="mr-3 group-hover:text-purple-400 transition-colors" />
                        <span className="text-sm">Search...</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <div className="p-2 hover:bg-slate-800 rounded-full hover:text-white transition-all cursor-pointer"><Bell size={20} /></div>
                        <div className="p-2 hover:bg-slate-800 rounded-full hover:text-white transition-all cursor-pointer"><UserCircle size={28} /></div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">

                {/* --- LINKE SPALTE --- */}
                <div className="flex flex-col gap-8">

                    {/* 1. ME TIME TRACKER */}
                    <div className="bg-gradient-to-br from-slate-900/60 to-purple-900/20 backdrop-blur-md border border-white/10 rounded-[32px] p-8 flex flex-col shadow-lg hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles size={20} className="text-purple-400" /> Me Time Tracker</h3>
                                <p className="text-purple-200/50 text-sm">Zeit für mich selbst</p>
                            </div>
                            <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/20">
                                Ziel: {WEEKLY_GOAL}h
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400 font-bold">{meTimeHours} / {WEEKLY_GOAL} Stunden</span>
                                    <span className="text-purple-400 font-bold">{Math.round(progressPercent)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-white/5">
                                    <motion.div
                                        className="bg-purple-500 h-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleUpdateTime(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all active:scale-95 border border-white/5">-</button>
                                <button onClick={() => handleUpdateTime(1)} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95 hover:scale-105 flex items-center gap-2">
                                    <Clock size={18} /> <span>+1h</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. NEURAL DUMP (Dashboard Notes) */}
                    <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-2xl flex-1 flex flex-col min-h-[300px] hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cloud className="text-blue-400" size={20} /> Neural Dump
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">Gedanken, die du im Dashboard festgehalten hast. Klicke zum Löschen (Verarbeiten).</p>

                        <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {brainDumpItems.length === 0 ? (
                                    <div className="text-center py-10 text-slate-600 text-sm border-2 border-dashed border-slate-800 rounded-xl">
                                        Kopf ist leer. <br /> Nutze die "Quick Capture" Bar im Dashboard.
                                    </div>
                                ) : brainDumpItems.map((note) => (
                                    <motion.div
                                        key={note.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-purple-500/30 flex items-center justify-between transition-all hover:bg-slate-800/60"
                                    >
                                        <p className="text-slate-300 text-sm">{note.content}</p>
                                        <button
                                            onClick={() => handleProcessBrainDump(note.id)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-all"
                                            title="Als verarbeitet markieren"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>

                {/* --- RECHTE SPALTE: JOURNAL --- */}
                <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-2xl h-full flex flex-col min-h-[600px] hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <BookOpen className="text-purple-400" size={20} /> Reflection Journal
                        </h3>
                        <div className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                            {journalEntries.length} Einträge
                        </div>
                    </div>

                    {/* Input Area */}
                    <form ref={formRef} action={handleAddJournal} className="mb-8">
                        <textarea
                            name="content"
                            placeholder="Wie fühlst du dich heute? Was beschäftigt dich?"
                            className="w-full h-32 bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none hover:bg-slate-800/50 mb-4"
                            required
                        />

                        <div className="flex justify-between items-center">
                            {/* Mood Selector */}
                            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5">
                                <button type="button" onClick={() => setSelectedMood("Good")} className={`p-2 rounded-lg transition-all ${selectedMood === "Good" ? "bg-green-500/20 text-green-400" : "text-slate-500 hover:text-white"}`}><Smile size={20} /></button>
                                <button type="button" onClick={() => setSelectedMood("Neutral")} className={`p-2 rounded-lg transition-all ${selectedMood === "Neutral" ? "bg-yellow-500/20 text-yellow-400" : "text-slate-500 hover:text-white"}`}><Meh size={20} /></button>
                                <button type="button" onClick={() => setSelectedMood("Bad")} className={`p-2 rounded-lg transition-all ${selectedMood === "Bad" ? "bg-red-500/20 text-red-400" : "text-slate-500 hover:text-white"}`}><Frown size={20} /></button>
                            </div>

                            <button type="submit" disabled={isPending} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                <Plus size={18} /> {isPending ? "Speichere..." : "Speichern"}
                            </button>
                        </div>
                    </form>

                    {/* Journal List */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        <AnimatePresence mode="popLayout">
                            {journalEntries.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4 opacity-50">
                                    <BookOpen size={40} strokeWidth={1} />
                                    <p className="text-sm">Dein Journal ist noch leer.</p>
                                </div>
                            ) : journalEntries.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group p-5 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-purple-500/30 transition-all hover:bg-slate-800/60 hover:translate-x-1"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            {new Date(entry.createdAt).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {/* Mood Badge */}
                                        {entry.mood === "Good" && <span className="text-green-400"><Smile size={16} /></span>}
                                        {entry.mood === "Neutral" && <span className="text-yellow-400"><Meh size={16} /></span>}
                                        {entry.mood === "Bad" && <span className="text-red-400"><Frown size={16} /></span>}
                                    </div>
                                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>

                                    <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDeleteJournal(entry.id)} className="text-slate-600 hover:text-red-400 text-xs flex items-center gap-1 transition-colors">
                                            <Trash2 size={12} /> Löschen
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}
