"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, Bell, UserCircle, GraduationCap, Clock, Trash2, AlertCircle, FileText, Plus, Calendar as CalIcon, Check, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPEN ---
type Task = {
    id: number;
    text: string;
    completed: boolean;
    tag: "Exam" | "Assignment" | "Study";
};

type Exam = {
    id: number;
    subject: string;
    date: string; // Format: YYYY-MM-DD
};

export default function UniPage() {
    // --- STATE ---
    const [sessions, setSessions] = useState(0);
    // NEU: Ziel auf 7 erhöht
    const WEEKLY_GOAL = 7;

    // Tasks
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskInput, setNewTaskInput] = useState("");

    // Exams
    const [exams, setExams] = useState<Exam[]>([]);
    const [showExamInput, setShowExamInput] = useState(false);
    const [newExamSubject, setNewExamSubject] = useState("");
    const [newExamDate, setNewExamDate] = useState("");

    // --- LOAD DATA ---
    useEffect(() => {
        const savedSessions = localStorage.getItem("uni-data-v1");
        if (savedSessions) setSessions(parseInt(savedSessions));

        const savedTasks = localStorage.getItem("uni-tasks-v1");
        if (savedTasks) setTasks(JSON.parse(savedTasks));

        const savedExams = localStorage.getItem("uni-exams-v1");
        if (savedExams) {
            setExams(JSON.parse(savedExams));
        } else {
            setExams([
                { id: 1, subject: "Statistik II", date: "2026-01-24" },
                { id: 2, subject: "Wirtschaftsinformatik", date: "2026-02-03" }
            ]);
        }
    }, []);

    // --- HELPER ---
    const getDaysLeft = (dateString: string) => {
        const examDate = new Date(dateString);
        const today = new Date();
        const diffTime = examDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // --- ACTIONS ---

    // 1. Session Log (Hinzufügen)
    const addSession = () => {
        const newCount = sessions + 1;
        setSessions(newCount);
        localStorage.setItem("uni-data-v1", newCount.toString());
        window.dispatchEvent(new Event("storage"));
    };

    // NEU: Session Log (Entfernen / Korrektur)
    const removeSession = () => {
        if (sessions > 0) {
            const newCount = sessions - 1;
            setSessions(newCount);
            localStorage.setItem("uni-data-v1", newCount.toString());
            window.dispatchEvent(new Event("storage"));
        }
    };

    // Tasks Logic
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskInput.trim()) return;
        const newTask: Task = { id: Date.now(), text: newTaskInput, completed: false, tag: "Study" };
        const updated = [newTask, ...tasks];
        setTasks(updated);
        localStorage.setItem("uni-tasks-v1", JSON.stringify(updated));
        setNewTaskInput("");
    };

    const toggleTask = (id: number) => {
        const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        setTasks(updated);
        localStorage.setItem("uni-tasks-v1", JSON.stringify(updated));
    };

    const deleteTask = (id: number) => {
        const updated = tasks.filter(t => t.id !== id);
        setTasks(updated);
        localStorage.setItem("uni-tasks-v1", JSON.stringify(updated));
    };

    // Exams Logic
    const handleAddExam = () => {
        if (!newExamSubject || !newExamDate) return;
        const newExam: Exam = { id: Date.now(), subject: newExamSubject, date: newExamDate };
        const updated = [...exams, newExam].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setExams(updated);
        localStorage.setItem("uni-exams-v1", JSON.stringify(updated));
        setNewExamSubject("");
        setNewExamDate("");
        setShowExamInput(false);
    };

    const deleteExam = (id: number) => {
        const updated = exams.filter(e => e.id !== id);
        setExams(updated);
        localStorage.setItem("uni-exams-v1", JSON.stringify(updated));
    };

    const progressPercent = Math.min((sessions / WEEKLY_GOAL) * 100, 100);

    return (
        <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans selection:bg-indigo-500/30">
            <div className="relative z-50 h-full flex-shrink-0"><Sidebar /></div>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto p-6 md:p-8 gap-8">

                {/* BACKGROUND */}
                <div className="fixed top-0 left-0 right-0 h-full pointer-events-none overflow-hidden z-0 bg-[#0f1115]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0f1115] to-[#0f1115]"></div>
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                </div>

                {/* HEADER */}
                <header className="flex justify-between items-center relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            University & Focus <GraduationCap className="text-indigo-400" size={28} />
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Prüfungsphase & Deadlines</p>
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

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">

                    {/* LINKE SPALTE */}
                    <div className="flex flex-col gap-8">

                        {/* SESSION TRACKER (UPDATE: Mit Minus-Button) */}
                        <div className="bg-gradient-to-br from-slate-900/60 to-indigo-900/20 backdrop-blur-md border border-white/10 rounded-[32px] p-8 flex flex-col shadow-lg">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Study Sessions</h3>
                                    <p className="text-indigo-200/50 text-sm">Fokus Zeit diese Woche</p>
                                </div>
                                <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs border border-indigo-500/20">
                                    Ziel: {WEEKLY_GOAL}h
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-400 font-bold">{sessions} / {WEEKLY_GOAL} Sessions</span>
                                        <span className="text-indigo-400 font-bold">{Math.round(progressPercent)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-white/5">
                                        <motion.div
                                            className="bg-indigo-500 h-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </div>

                                {/* Button Gruppe */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={removeSession}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all border border-white/5 active:scale-95"
                                        title="Letzte Session entfernen"
                                    >
                                        <Minus size={18} />
                                    </button>

                                    <button
                                        onClick={addSession}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex flex-col items-center justify-center h-14 min-w-[100px]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Clock size={18} /> <span>+1h</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* EXAM TRACKER (UPDATE: Better Animations) */}
                        <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-2xl flex-1 flex flex-col min-h-[400px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <AlertCircle className="text-orange-400" size={20} /> Anstehende Prüfungen
                                </h3>
                                <button
                                    onClick={() => setShowExamInput(!showExamInput)}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-300 hover:text-white"
                                >
                                    {showExamInput ? <Check size={18} /> : <Plus size={18} />}
                                </button>
                            </div>

                            <AnimatePresence>
                                {showExamInput && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mb-4 overflow-hidden"
                                    >
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text" placeholder="Fach (z.B. Mathe)"
                                                value={newExamSubject} onChange={e => setNewExamSubject(e.target.value)}
                                                className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                            />
                                            <input
                                                type="date"
                                                value={newExamDate} onChange={e => setNewExamDate(e.target.value)}
                                                className="bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <button onClick={handleAddExam} className="w-full py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors">
                                            Prüfung hinzufügen
                                        </button>
                                        <hr className="border-white/5 my-4" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {exams.length === 0 ? (
                                        <motion.p
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="text-slate-500 text-sm text-center py-4"
                                        >
                                            Keine Prüfungen eingetragen.
                                        </motion.p>
                                    ) : exams.map((exam) => {
                                        const days = getDaysLeft(exam.date);
                                        return (
                                            <motion.div
                                                key={exam.id}
                                                layout // WICHTIG: Sorgt für flüssiges Umsortieren
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.9, opacity: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                className="group p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/30 transition-colors flex items-center justify-between relative cursor-default"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex flex-col items-center justify-center border border-white/5 group-hover:border-indigo-500/50 transition-colors">
                                                        <CalIcon size={16} className="text-slate-500 mb-0.5 group-hover:text-indigo-400 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{exam.subject}</h4>
                                                        <p className="text-xs text-slate-500">{exam.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right mr-6">
                                                    <span className={`block text-xl font-black ${days <= 7 ? 'text-red-400 animate-pulse' : 'text-indigo-400'}`}>{days}</span>
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold">Tage</span>
                                                </div>
                                                <button
                                                    onClick={() => deleteExam(exam.id)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 p-2 transition-all bg-slate-900/80 rounded-lg backdrop-blur-sm"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* RECHTE SPALTE: TASKS */}
                    <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-2xl h-full flex flex-col min-h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-indigo-400" size={20} /> Tasks & To-Dos
                            </h3>
                            <div className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                                {tasks.filter(t => !t.completed).length} Offen
                            </div>
                        </div>

                        <form onSubmit={handleAddTask} className="relative mb-6">
                            <input
                                type="text" value={newTaskInput} onChange={(e) => setNewTaskInput(e.target.value)}
                                placeholder="Neue Aufgabe..."
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                            />
                            <button type="submit" className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
                                <Plus size={20} />
                            </button>
                        </form>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            <AnimatePresence mode="popLayout">
                                {tasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`group p-4 rounded-xl border transition-all flex items-center gap-4 select-none ${task.completed ? "bg-slate-900/30 border-transparent opacity-60" : "bg-slate-800/40 border-white/5 hover:border-indigo-500/30"}`}
                                    >
                                        <div onClick={() => toggleTask(task.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${task.completed ? "bg-indigo-500 border-indigo-500" : "border-slate-600 hover:border-indigo-400"}`}>
                                            {task.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-medium text-sm transition-all ${task.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>{task.text}</p>
                                        </div>
                                        <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-2"><Trash2 size={16} /></button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}