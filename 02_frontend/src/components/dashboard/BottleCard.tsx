"use client";

import { motion } from "framer-motion";
import { Plus, Minus, Maximize2 } from "lucide-react";
import Link from "next/link";

interface BottleCardProps {
    id: string;
    label: string;
    progress: number;
    color?: string;
    shape?: string;
    image?: string; // Optional, falls wir es später wieder brauchen
    onUpdate: (amount: number) => void;
}

// 1. Farb-Definitionen (Nur die Hex-Werte, kein JSX!)
// Damit vermeiden wir den Key-Error, weil wir das JSX erst in der Komponente bauen.
const colorThemes: Record<string, { start: string; mid: string; end: string }> = {
    indigo: { start: "#312e81", mid: "#6366f1", end: "#a5b4fc" },
    teal: { start: "#134e4a", mid: "#14b8a6", end: "#5eead4" },
    yellow: { start: "#713f12", mid: "#eab308", end: "#fde047" },
    green: { start: "#064e3b", mid: "#10b981", end: "#6ee7b7" },
    red: { start: "#881337", mid: "#ef4444", end: "#fca5a5" },
    purple: { start: "#4c1d95", mid: "#8b5cf6", end: "#c4b5fd" },
    blue: { start: "#1e40af", mid: "#3b82f6", end: "#93c5fd" },
};

// 2. Formen-Pfade (SVG)
const bottleShapes: Record<string, string> = {
    potion: "M50,10 C60,10 65,25 65,35 C85,45 95,75 95,105 C95,135 75,155 50,155 C25,155 5,135 5,105 C5,75 15,45 35,35 C35,25 40,10 50,10 Z",
    diamond: "M50,5 L85,35 L95,85 L50,155 L5,85 L15,35 Z",
    square: "M20,10 C25,5 75,5 80,10 L90,30 C92,35 92,130 90,135 L80,155 C75,160 25,160 20,155 L10,135 C8,130 8,35 10,30 Z",
    leaf: "M50,5 C50,5 95,45 95,100 C95,140 75,160 50,160 C25,160 5,140 5,100 C5,45 50,5 50,5 Z",
    heart: "M50,35 C65,10 100,20 100,65 C100,110 50,160 50,160 C50,160 0,110 0,65 C0,20 35,10 50,35 Z",
    cloud: "M30,20 C40,10 60,10 70,20 C85,15 100,30 100,50 C100,65 90,75 80,80 C90,90 95,110 85,125 C75,140 55,140 45,130 C35,145 15,140 5,125 C-5,110 0,90 10,80 C0,75 -5,55 5,40 C15,25 25,25 30,20 Z",
};

export default function BottleCard({ id, label, progress, color = "indigo", shape = "potion", onUpdate }: BottleCardProps) {
    const linkTarget = id ? `/${id}` : "/";

    // Wir holen uns die Daten für DIESE Karte
    const pathData = bottleShapes[shape] || bottleShapes.potion;
    const theme = colorThemes[color] || colorThemes.blue;

    // Einzigartige IDs für diese Karte generieren (Wichtig gegen Fehler!)
    const gradientId = `grad-${id}`;
    const maskId = `mask-${id}`;

    // Wasserhöhe berechnen (160 ist leer, 0 ist voll in SVG Koordinaten hier)
    const waterLevel = 160 - (160 * (progress / 100));

    return (
        <div className="flex flex-col items-center gap-5 group">

            {/* SVG Container */}
            <div className="relative w-[160px] h-[220px] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
                <svg viewBox="-10 -10 120 180" className="w-full h-full overflow-visible drop-shadow-xl">
                    <defs>
                        {/* HIER WAR DER FEHLER: Wir definieren jetzt nur noch EINEN Verlauf.
                Genau den, den wir brauchen. Keine Liste, keine Key-Errors.
            */}
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={theme.start} />
                            <stop offset="50%" stopColor={theme.mid} />
                            <stop offset="100%" stopColor={theme.end} />
                        </linearGradient>

                        {/* Die Maske (Die Form der Flasche) */}
                        <clipPath id={maskId}>
                            <path d={pathData} />
                        </clipPath>
                    </defs>

                    {/* GRUPPE MIT MASKE (Alles hier drin wird auf die Flaschenform zugeschnitten) */}
                    <g clipPath={`url(#${maskId})`}>
                        {/* 1. Leeres Glas (Hintergrund) */}
                        <path d={pathData} fill="#e2e8f0" fillOpacity="0.3" />

                        {/* 2. Das Wasser (Animiertes Rechteck) */}
                        <motion.rect
                            x="-50"
                            y={waterLevel} // Startpunkt (wird überschrieben durch animate)
                            width="200"
                            height="250"
                            fill={`url(#${gradientId})`}
                            initial={{ y: 160 }}
                            animate={{ y: waterLevel }}
                            transition={{ type: "spring", damping: 20, stiffness: 50 }}
                        />
                    </g>

                    {/* 3. Glas-Kontur (Liegt oben drauf, unmaskiert) */}
                    <path d={pathData} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="4" opacity="0.5" />
                    <path d={pathData} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
                </svg>

                {/* Prozentzahl */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 mt-2">
                    <span className="text-3xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{progress}%</span>
                </div>

                {/* Steuerung Overlay */}
                <div className="absolute inset-0 flex justify-between items-center -mx-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    <button onClick={() => onUpdate(-10)} className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2 shadow-lg"><Minus size={20} /></button>
                    <button onClick={() => onUpdate(10)} className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2 shadow-lg"><Plus size={20} /></button>
                </div>

                {/* Detail Icon */}
                <Link href={linkTarget} className="absolute top-0 right-0 p-2 bg-white/10 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all z-30 backdrop-blur-md">
                    <Maximize2 size={14} />
                </Link>
            </div>

            {/* Label unten */}
            <Link href={linkTarget}>
                <div className="px-6 py-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm text-gray-800 font-bold text-sm border-2 border-white/50 cursor-pointer hover:bg-white transition-all">
                    {label}
                </div>
            </Link>
        </div>
    );
}