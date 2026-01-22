"use client";

import { motion } from "framer-motion";
import { Plus, Minus, Maximize2 } from "lucide-react";
import Link from "next/link";
import { COLOR_THEMES, BOTTLE_SHAPES } from "@/lib/constants";

interface BottleCardProps {
    id: string;
    label: string;
    progress: number;
    color?: string;
    shape?: string;
    onUpdate: (amount: number) => void;
}

export default function BottleCard({ id, label, progress, color = "indigo", shape = "potion", onUpdate }: BottleCardProps) {
    const linkTarget = id ? `/${id}` : "/";

    const pathData = BOTTLE_SHAPES[shape as keyof typeof BOTTLE_SHAPES] || BOTTLE_SHAPES.potion;
    const theme = COLOR_THEMES[color as keyof typeof COLOR_THEMES] || COLOR_THEMES.blue;

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
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={theme.start} />
                            <stop offset="50%" stopColor={theme.mid} />
                            <stop offset="100%" stopColor={theme.end} />
                        </linearGradient>

                        <clipPath id={maskId}>
                            <path d={pathData} />
                        </clipPath>
                    </defs>

                    <g clipPath={`url(#${maskId})`}>
                        <path d={pathData} fill="#e2e8f0" fillOpacity="0.3" />

                        <motion.rect
                            x="-50"
                            y={waterLevel}
                            width="200"
                            height="250"
                            fill={`url(#${gradientId})`}
                            initial={{ y: 160 }}
                            animate={{ y: waterLevel }}
                            transition={{ type: "spring", damping: 20, stiffness: 50 }}
                        />
                    </g>

                    {/* Glass outline */}
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