"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Datenstruktur muss exakt zur Unterseite passen
type ReadingData = {
    day1: boolean; day2: boolean; day3: boolean; day4: boolean; day5: boolean; day6: boolean; day7: boolean;
};

export default function ReadingWidget() {
    const [data, setData] = useState<ReadingData>({
        day1: false, day2: false, day3: false, day4: false, day5: false, day6: false, day7: false
    });
    const [mounted, setMounted] = useState(false);

    // Feste Reihenfolge der Tage für die "Nächster Tag"-Logik
    const orderedKeys: (keyof ReadingData)[] = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];

    // Funktion zum Laden der Daten
    const loadData = () => {
        const saved = localStorage.getItem("reading-data-v1"); // WICHTIG: Prüfe, ob dieser Key auch in deiner Unterseite genutzt wird!
        if (saved) {
            setData(JSON.parse(saved));
        }
    };

    useEffect(() => {
        setMounted(true);
        loadData();

        // Event Listener: Aktualisiert das Widget, wenn sich localStorage ändert (z.B. in anderem Tab)
        window.addEventListener("storage", loadData);
        // Event Listener: Aktualisiert das Widget, wenn das Fenster wieder Fokus bekommt (z.B. Zurück-Button)
        window.addEventListener("focus", loadData);

        return () => {
            window.removeEventListener("storage", loadData);
            window.removeEventListener("focus", loadData);
        };
    }, []);

    // Button Logik: Nächsten offenen Tag finden
    const handleQuickAdd = (e: MouseEvent) => {
        e.preventDefault();     // Verhindert Navigation
        e.stopPropagation();    // Verhindert Klick-Bubbling

        // Wir suchen den ersten Tag in der Liste, der noch "false" ist
        const nextKey = orderedKeys.find(key => !data[key]);

        if (nextKey) {
            const newData = { ...data, [nextKey]: true };
            setData(newData); // UI sofort updaten
            localStorage.setItem("reading-data-v1", JSON.stringify(newData)); // Speichern

            // Optional: Event feuern, damit andere Komponenten es mitbekommen
            window.dispatchEvent(new Event("storage"));
        }
    };

    // Berechnung
    const completedCount = Object.values(data).filter(Boolean).length;
    const WEEKLY_GOAL = 7;
    const progressPercent = (completedCount / WEEKLY_GOAL) * 100;

    // Farben (Violett Theme)
    const getColorStatus = (count: number) => {
        if (count >= 7) return { stroke: "#a855f7", shadow: "rgba(168,85,247,0.6)" }; // Lila (Ziel)
        if (count >= 4) return { stroke: "#eab308", shadow: "rgba(234,179,8,0.6)" };  // Gelb (Unterwegs)
        if (count >= 1) return { stroke: "#3b82f6", shadow: "rgba(59,130,246,0.6)" }; // Blau (Start)
        return { stroke: "#64748b", shadow: "rgba(100,116,139,0.4)" }; // Grau
    };

    const currentStyle = getColorStatus(completedCount);

    if (!mounted) return null;

    return (
        <Link href="/lesen" className="block h-full w-full">
            {/* CONTAINER: Lila/Slate Gradient */}
            <div className="h-full w-full bg-gradient-to-br from-slate-900/60 to-purple-900/20 backdrop-blur-md border border-white/10 rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-purple-500/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-transform duration-300 will-change-transform cursor-pointer">

                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Lesen</h3>
                        <p className="text-purple-200/50 text-xs mt-0.5">30 min • Täglich</p>
                    </div>
                    <div className="text-slate-500 text-xl">⋮</div>
                </div>

                {/* KREIS DIAGRAMM */}
                <div className="flex-1 flex items-center justify-center py-2">
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="10" fill="transparent" opacity="0.3" />
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
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        ZIEL: {completedCount} / {WEEKLY_GOAL} TAGE
                    </span>

                    <button
                        onClick={handleQuickAdd}
                        className={`
                        w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 z-20 relative
                        ${completedCount >= WEEKLY_GOAL
                                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-500"
                                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                            }
                    `}
                    >
                        {completedCount >= WEEKLY_GOAL ? (
                            <>Erledigt <Check size={16} strokeWidth={3} /></>
                        ) : (
                            <>+ Eintragen</>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}