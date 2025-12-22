"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UniWidget() {
    const router = useRouter();
    const [sessions, setSessions] = useState(0);
    const [mounted, setMounted] = useState(false);

    // Wochenziel: 7 Tage lernen
    const WEEKLY_GOAL = 7;

    // Laden
    const loadData = () => {
        const saved = localStorage.getItem("uni-data-v1");
        if (saved) {
            // Wir speichern hier einfach die Anzahl der Sessions
            setSessions(parseInt(saved));
        }
    };

    useEffect(() => {
        setMounted(true);
        loadData();
        window.addEventListener("storage", loadData);
        return () => window.removeEventListener("storage", loadData);
    }, []);

    // Button: Session hinzufügen
    const handleAddSession = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Logik: Zähler erhöhen (max 5, dann Reset auf 0 zum Testen oder Bleiben)
        // Wir machen es so: Wenn Ziel erreicht, bleibt es voll. Reset müsste man manuell machen (oder wir bauen das später).
        const newCount = sessions < WEEKLY_GOAL ? sessions + 1 : 0;

        setSessions(newCount);
        localStorage.setItem("uni-data-v1", newCount.toString());
        window.dispatchEvent(new Event("storage"));
    };

    // Klick auf Karte -> zur Unterseite
    const handleCardClick = () => {
        router.push("/uni");
    };

    // Berechnung
    const progressPercent = (sessions / WEEKLY_GOAL) * 100;

    // Farben (Indigo Theme)
    const getColorStatus = (count: number) => {
        if (count >= 5) return { stroke: "#6366f1", shadow: "rgba(99,102,241,0.6)" }; // Indigo 500 (Ziel)
        if (count >= 3) return { stroke: "#818cf8", shadow: "rgba(129,140,248,0.6)" }; // Indigo 400
        return { stroke: "#4f46e5", shadow: "rgba(79,70,229,0.4)" }; // Indigo 600
    };

    const currentStyle = getColorStatus(sessions);

    if (!mounted) return null;

    return (
        <div
            onClick={handleCardClick}
            className="block h-full w-full cursor-pointer"
        >
            <div className="h-full w-full bg-gradient-to-br from-slate-900/60 to-indigo-900/20 backdrop-blur-md border border-white/10 rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-indigo-500/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-transform duration-300 will-change-transform">

                {/* HEADER */}
                <div className="flex justify-between items-start pointer-events-none">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">Uni</h3>
                        <p className="text-indigo-200/50 text-xs mt-0.5">1h Deep Work</p>
                    </div>
                    <div className="text-indigo-500/20"><GraduationCap size={20} /></div>
                </div>

                {/* KREIS DIAGRAMM */}
                <div className="flex-1 flex items-center justify-center py-2 pointer-events-none">
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Hintergrund */}
                            <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="10" fill="transparent" opacity="0.3" />

                            {/* Fortschritt */}
                            <motion.circle
                                cx="64" cy="64" r="56"
                                stroke={currentStyle.stroke}
                                strokeWidth="10"
                                fill="transparent"
                                strokeLinecap="round"
                                strokeDasharray="351"
                                animate={{ strokeDashoffset: 351 - (351 * progressPercent / 100) }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ filter: `drop-shadow(0 0 15px ${currentStyle.shadow})` }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{Math.round(progressPercent)}%</span>
                        </div>
                    </div>
                </div>

                {/* FOOTER BUTTON */}
                <div className="flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pointer-events-none">
                        WOCHE: {sessions} / {WEEKLY_GOAL} SESSIONS
                    </span>

                    <button
                        onClick={handleAddSession}
                        className={`
                        w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 z-20 relative
                        ${sessions >= WEEKLY_GOAL
                                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-500"
                                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                            }
                    `}
                    >
                        {sessions >= WEEKLY_GOAL ? (
                            <>Ziel erreicht <Check size={16} strokeWidth={3} /></>
                        ) : (
                            <>+ Done (1h)</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}