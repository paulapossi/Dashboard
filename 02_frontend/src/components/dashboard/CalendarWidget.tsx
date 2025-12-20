"use client";

import { useState, useEffect } from "react";
import { Settings, Plus, Pencil, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarWidget() {
    // --- STATE ---
    const [view, setView] = useState<'weekly' | 'monthly'>('weekly'); // Ansicht
    const [currentDate, setCurrentDate] = useState(new Date());       // Datum für Navigation (welcher Monat/Woche wird angezeigt)
    const [selectedDate, setSelectedDate] = useState(new Date());     // Welcher Tag ist ausgewählt (weißer Kreis)
    const [note, setNote] = useState("");                             // Notiz Input

    // --- HILFSFUNKTIONEN ---

    // Wochen-Tage generieren (basierend auf currentDate)
    const getWeekDays = (date: Date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Montag als Start
        startOfWeek.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            return d;
        });
    };

    // Monats-Tage generieren
    const getMonthDays = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = So, 1 = Mo...
        // Montag Anpassung (Mo=0, So=6 für Grid Logik)
        const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        const blanks = Array(offset).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

        return [...blanks, ...days];
    };

    // --- NAVIGATION ---
    const handlePrev = () => {
        const newDate = new Date(currentDate);
        if (view === 'weekly') newDate.setDate(newDate.getDate() - 7);
        else newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (view === 'weekly') newDate.setDate(newDate.getDate() + 7);
        else newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    // Prüfen ob zwei Datumsobjekte der gleiche Tag sind
    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const handleAddNote = () => {
        if (!note.trim()) return;
        alert(`Notiz für ${selectedDate.toLocaleDateString()} gespeichert: ${note}`);
        setNote(""); // Input leeren
    };

    // Daten für die aktuelle Ansicht
    const daysToRender = view === 'weekly' ? getWeekDays(currentDate) : getMonthDays(currentDate);
    const weekDayNames = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
    const monthName = currentDate.toLocaleString('de-DE', { month: 'long' });

    return (
        <div className="w-full h-full bg-gradient-to-br from-[#1e293b] to-[#172554] rounded-[32px] p-6 md:p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between">

            {/* 1. HEADER */}
            <div>
                <div className="flex justify-between items-start mb-6">
                    {/* Switcher */}
                    <div className="bg-[#0f172a]/50 p-1 rounded-full flex items-center backdrop-blur-md">
                        <button
                            onClick={() => { setView('weekly'); setCurrentDate(new Date()); }} // Reset auf heute bei Wechsel
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${view === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => { setView('monthly'); setCurrentDate(new Date()); }}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${view === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <Settings size={22} />
                    </button>
                </div>

                {/* Datum & Navigation */}
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-1 transition-all">
                            {monthName}
                        </h2>
                        <span className="text-xl text-slate-400 font-medium">{currentDate.getFullYear()}</span>
                    </div>
                    {/* Navigations Pfeile */}
                    <div className="flex gap-2 mb-2">
                        <button onClick={handlePrev} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={handleNext} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>
            </div>

            {/* 2. GRID AREA (Wechselt zwischen Weekly/Monthly) */}
            <div className="flex-1 flex flex-col justify-center py-2">

                {/* Wochen-Ansicht */}
                {view === 'weekly' && (
                    <div className="flex justify-between items-center w-full px-1">
                        {daysToRender.map((date, index) => {
                            if (!date) return null;
                            const isSelected = isSameDay(date, selectedDate);
                            // Wochentag Name holen (Kurzform)
                            const dayName = weekDayNames[index];

                            return (
                                <div key={index} onClick={() => setSelectedDate(date)} className="flex flex-col items-center gap-4 group cursor-pointer flex-1">
                                    <span className={`text-xs font-bold tracking-wider transition-colors ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                        {dayName}
                                    </span>
                                    <div className={`
                                w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full text-lg md:text-xl font-bold transition-all
                                ${isSelected
                                            ? "bg-white text-blue-900 shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-110"
                                            : "text-white hover:bg-white/10 border border-transparent hover:border-white/10"
                                        }
                            `}>
                                        {date.getDate()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Monats-Ansicht */}
                {view === 'monthly' && (
                    <div className="w-full">
                        {/* Wochentage Header */}
                        <div className="grid grid-cols-7 mb-2 text-center">
                            {weekDayNames.map(d => <span key={d} className="text-[10px] font-bold text-slate-500">{d}</span>)}
                        </div>
                        {/* Tage Grid */}
                        <div className="grid grid-cols-7 gap-y-2 gap-x-1 place-items-center">
                            {daysToRender.map((date, index) => {
                                if (!date) return <div key={`blank-${index}`} className="w-8 h-8" />;
                                const isSelected = isSameDay(date, selectedDate);
                                const isToday = isSameDay(date, new Date());

                                return (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedDate(date)}
                                        className={`
                                    w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm font-bold cursor-pointer transition-all
                                    ${isSelected
                                                ? "bg-white text-blue-900 shadow-lg scale-110"
                                                : isToday ? "bg-blue-600/30 text-blue-200 border border-blue-400/50" : "text-slate-300 hover:bg-white/10"
                                            }
                                `}
                                    >
                                        {date.getDate()}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>

            {/* 3. FOOTER: Input */}
            <div className="flex items-center gap-4 mt-4">
                <div className="flex-1 h-12 md:h-14 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl flex items-center px-5 gap-3 border border-white/5 focus-within:border-white/20 focus-within:bg-white/10">
                    <Pencil size={18} className="text-slate-400" />
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                        placeholder="Notiz hinzufügen..."
                        className="bg-transparent w-full text-sm text-white placeholder-slate-400 focus:outline-none"
                    />
                </div>
                <button
                    onClick={handleAddNote}
                    className="h-12 md:h-14 px-6 md:px-8 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 transition-all rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-blue-900/50 text-nowrap"
                >
                    <Plus size={20} />
                    <span className="hidden md:inline">Neu</span>
                </button>
            </div>

        </div>
    );
}