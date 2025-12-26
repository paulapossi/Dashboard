"use client";

import { motion } from "framer-motion";
import { MoreVertical, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RingCardProps {
    id: string;
    label: string;
    progress: number;
    color?: string;
    onUpdate: (amount: number) => void;
}

// Farben angepasst an das Dashboard-Design (Logische Zuordnung)
const themeColors: Record<string, { stroke: string; text: string; shadow: string }> = {
    indigo: { stroke: "#6366f1", text: "text-indigo-400", shadow: "rgba(99,102,241,0.5)" }, // Uni
    teal: { stroke: "#14b8a6", text: "text-teal-400", shadow: "rgba(20,184,166,0.5)" }, // Sport
    yellow: { stroke: "#eab308", text: "text-yellow-400", shadow: "rgba(234,179,8,0.5)" },  // Lesen
    green: { stroke: "#22c55e", text: "text-emerald-400", shadow: "rgba(34,197,94,0.5)" }, // Ernährung
    red: { stroke: "#ef4444", text: "text-red-400", shadow: "rgba(239,68,68,0.5)" },  // Paula
    purple: { stroke: "#a855f7", text: "text-purple-400", shadow: "rgba(168,85,247,0.5)" }, // Mental
};

export default function RingCard({ id, label, progress, color = "indigo", onUpdate }: RingCardProps) {
    // Fallback auf Indigo, falls Farbe nicht gefunden
    const theme = themeColors[color] || themeColors.indigo;
    const linkTarget = id ? `/${id}` : "/";

    // SVG Konfiguration
    const radius = 56; // Etwas größer
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        // CONTAINER: will-change-transform verhindert Unschärfe beim Skalieren
        <div className="h-full w-full bg-[#1e293b]/90 border border-white/5 rounded-[32px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-white/20 transition-colors duration-300 cursor-pointer">

            {/* Link über die gesamte Karte (außer Button) */}
            <Link href={linkTarget} className="absolute inset-0 z-0" />

            {/* 1. HEADER */}
            <div className="flex justify-between items-start relative z-10 pointer-events-none">
                <div className="flex items-center gap-3">
                    <span className={`font-bold text-xl text-white group-hover:${theme.text} transition-colors`}>{label}</span>
                </div>
                <div className="text-slate-500 group-hover:text-white transition-colors">
                    <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </div>
            </div>

            {/* 2. MAIN RING */}
            <div className="relative flex items-center justify-center py-4 z-10 pointer-events-none">
                <svg className="w-32 h-32 transform -rotate-90">
                    {/* Hintergrund Ring */}
                    <circle
                        cx="64" cy="64" r={radius}
                        stroke="#334155" strokeWidth="8" fill="transparent" opacity="0.3"
                    />
                    {/* Fortschritt Ring */}
                    <motion.circle
                        cx="64" cy="64" r={radius}
                        stroke={theme.stroke} strokeWidth="8" fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ filter: `drop-shadow(0 0 8px ${theme.shadow})` }}
                    />
                </svg>

                {/* Prozentzahl */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                </div>
            </div>

            {/* 3. FOOTER & ACTION */}
            <div className="flex flex-col gap-3 relative z-20">
                {/* Action Button (mit stopPropagation) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Verhindert, dass der Link ausgelöst wird
                        e.preventDefault();
                        onUpdate(10);
                    }}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl font-bold text-xs transition-all border border-white/5 hover:border-white/20 uppercase tracking-wider"
                >
                    + Log Progress
                </button>
            </div>

        </div>
    );
}