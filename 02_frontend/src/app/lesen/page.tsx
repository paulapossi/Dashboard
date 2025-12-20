"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, Bell, UserCircle, BookOpen, Clock, CheckCircle2, Plus, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export default function LesenPage() {
    // --- STATE: BÜCHER ---
    const [books, setBooks] = useState([
        {
            id: 1,
            title: "Der Alchimist",
            author: "Paulo Coelho",
            cover: "/book1.jpg", // Pfad zu deinem Bild im public Ordner
            status: "finished" // 'reading', 'finished', 'list'
        },
        {
            id: 2,
            title: "Eine kurze Geschichte der Menschheit",
            author: "Yuval Noah Harari",
            cover: "/book2.jpg",
            status: "reading"
        },
        {
            id: 3,
            title: "Dune",
            author: "Frank Herbert",
            cover: "/book3.jpg", // Falls Bild nicht existiert, zeigen wir Fallback
            status: "list"
        },
    ]);

    // --- STATE: TRACKER ---
    const [todayMinutes, setTodayMinutes] = useState(20);
    const GOAL = 30;

    // Hilfsfunktion: Fortschritt in Prozent (max 100%)
    const progressPercent = Math.min((todayMinutes / GOAL) * 100, 100);

    const addMinutes = (min: number) => {
        setTodayMinutes(prev => prev + min);
    };

    const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

    return (
        <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto p-6 md:p-8 gap-8">

                {/* HEADER */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Lesen</h1>
                        <p className="text-slate-400 text-sm mt-1">December 2025</p>
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

                {/* 1. WOCHENÜBERSICHT (Glassmorphism Header) */}
                <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    {/* Leichter Glanz-Effekt oben */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-200">Wochenübersicht</h2>
                        <MoreHorizontal className="text-slate-500 cursor-pointer hover:text-white" />
                    </div>

                    <div className="grid grid-cols-7 gap-2 md:gap-4">
                        {weekDays.map((day, i) => {
                            const isToday = day === "Fr"; // Fake Today
                            // Zufällige "Gelesen" Daten simulieren
                            const readMinutes = [45, 20, 0, 30, 20, 0, 0][i];
                            const hasRead = readMinutes > 0;

                            return (
                                <div key={day} className="flex flex-col items-center gap-3 group">
                                    <span className={`text-xs font-medium uppercase ${isToday ? 'text-white' : 'text-slate-500'}`}>{day}</span>

                                    {/* Timeline Bar */}
                                    <div className={`
                                w-full h-14 rounded-xl border flex items-center justify-center relative overflow-hidden transition-all
                                ${hasRead
                                            ? "bg-slate-700/50 border-slate-600/50 group-hover:border-slate-500"
                                            : "bg-slate-800/30 border-transparent"
                                        }
                            `}>
                                        {hasRead && (
                                            <>
                                                {/* Füllstand Indikator */}
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 bg-white/10"
                                                    style={{ height: `${Math.min(readMinutes * 2, 100)}%` }}
                                                />
                                                <BookOpen size={18} className="text-slate-300 relative z-10" />
                                                {/* Tooltip für Minuten */}
                                                <div className="absolute -top-8 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {readMinutes} min
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* BOTTOM GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                    {/* 2. LESELISTE (Links) */}
                    <div className="bg-[#1e293b]/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col gap-6 shadow-lg h-full">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-200">Leseliste</h3>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Plus size={20} className="text-slate-400" /></button>
                        </div>

                        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                            {books.map((book) => (
                                <div key={book.id} className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 rounded-2xl p-3 flex gap-4 transition-all">

                                    {/* COVER BILD */}
                                    <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-700 shadow-md">
                                        {/* Falls Bild da ist, zeigen wir es. Sonst Icon. */}
                                        {book.cover ? (
                                            <Image
                                                src={book.cover}
                                                alt={book.title}
                                                fill
                                                className="object-cover"
                                                // Damit Next.js nicht meckert, wenn das Bild fehlt (Fallback ist schwer in reinem Next/Image ohne component):
                                                onError={(e) => {
                                                    // Fallback Logic ist client-side komplexer, hier simpler Placeholder Stil
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                <BookOpen size={20} />
                                            </div>
                                        )}
                                    </div>

                                    {/* INFO TEXT */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h4 className="font-bold text-slate-200 leading-tight mb-1">{book.title}</h4>
                                        <p className="text-sm text-slate-500 mb-3">{book.author}</p>

                                        {/* Status Badges / Checkboxes */}
                                        <div className="flex gap-2 text-xs">
                                            <div className={`px-2 py-1 rounded-md border ${book.status === 'finished' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-slate-600 text-slate-500'}`}>
                                                Gelesen {book.status === 'finished' && '✓'}
                                            </div>
                                            <div className={`px-2 py-1 rounded-md border ${book.status === 'reading' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'border-slate-600 text-slate-500'}`}>
                                                Aktuell
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. TRACKER (Rechts) */}
                    <div className="bg-[#1e293b]/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-lg h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-200">Heutige Lesezeit</h3>
                            <Clock className="text-slate-500" size={20} />
                        </div>

                        {/* Main Progress Display */}
                        <div className="flex-1 flex flex-col justify-center items-center gap-2 mb-8">
                            <div className="text-6xl font-bold text-white tracking-tighter drop-shadow-lg">
                                {todayMinutes}<span className="text-2xl text-slate-500 font-normal ml-2">min</span>
                            </div>
                            <p className="text-slate-400 text-sm">Tagesziel: {GOAL} min</p>
                        </div>

                        {/* Progress Bar (Visual Slider) */}
                        <div className="mb-8 relative h-4 bg-slate-800 rounded-full overflow-visible">
                            {/* Background Track */}
                            <div className="absolute inset-0 rounded-full bg-slate-800 border border-white/5"></div>

                            {/* Fill Bar */}
                            <div
                                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-slate-400 to-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-700"
                                style={{ width: `${progressPercent}%` }}
                            >
                                {/* The "Knob" (Indicator) at the end */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-slate-300 translate-x-1/2"></div>
                            </div>
                        </div>

                        {/* Quick Add Buttons */}
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => addMinutes(15)}
                                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-white/20 transition-all text-sm font-medium text-slate-300"
                            >
                                + 15 Min.
                            </button>
                            <button
                                onClick={() => addMinutes(30)}
                                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-white/20 transition-all text-sm font-medium text-slate-300"
                            >
                                + 30 Min.
                            </button>
                            <button
                                onClick={() => setTodayMinutes(prev => prev + 45)} // oder manuell
                                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-white/20 transition-all text-sm font-medium text-slate-300"
                            >
                                {'>'} 30 Min.
                            </button>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-6 flex justify-between text-xs text-slate-500 border-t border-white/5 pt-4">
                            <span>Heute gelesen: {todayMinutes} Min.</span>
                            <span>Ziel: {GOAL} Min.</span>
                        </div>

                    </div>

                </div>

            </main>
        </div>
    );
}