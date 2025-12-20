"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar"; // <--- 1. WICHTIG: Sidebar importieren

export default function DetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [data, setData] = useState<any>(null);
    const [inputValue, setInputValue] = useState("");

    // Daten laden
    useEffect(() => {
        const savedData = localStorage.getItem("life-os-data");
        if (savedData) {
            const allCategories = JSON.parse(savedData);
            const category = allCategories.find((c: any) => c.id === id);

            if (category) {
                setData(category);
                setInputValue(category.progress.toString());
            } else {
                router.push("/");
            }
        }
    }, [id, router]);

    // Speichern
    const handleSave = () => {
        const savedData = localStorage.getItem("life-os-data");
        if (savedData && data) {
            const allCategories = JSON.parse(savedData);
            const updatedCategories = allCategories.map((c: any) =>
                c.id === id ? { ...c, progress: Number(inputValue) } : c
            );
            localStorage.setItem("life-os-data", JSON.stringify(updatedCategories));
            router.push("/");
        }
    };

    if (!data) return null;

    return (
        // <--- 2. WICHTIG: Das Layout muss identisch zur Startseite sein (flex, h-screen, background)
        <div className="flex h-screen p-4 md:p-6 gap-8 overflow-hidden bg-[#F3F4F6]">

            {/* <--- 3. WICHTIG: Hier wird die Sidebar eingefügt */}
            <Sidebar />

            {/* HAUPTINHALT (Rechts neben der Sidebar) */}
            <div className="flex-1 flex flex-col items-center justify-center min-w-0">

                {/* Die Karte */}
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-white/50 animate-in fade-in zoom-in duration-300">

                    {/* Header mit Zurück-Pfeil */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                            <ArrowLeft size={24} className="text-gray-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800 capitalize truncate">{data.label}</h1>
                    </div>

                    {/* Slider Bereich */}
                    <div className="mb-8">
                        <div className="text-gray-500 text-sm mb-2 font-medium uppercase tracking-wider">Aktueller Stand</div>
                        <div className="text-6xl font-black text-blue-600 flex items-baseline gap-2">
                            {inputValue}<span className="text-2xl text-gray-400">%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="100"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full mt-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    {/* Speichern Button */}
                    <button
                        onClick={handleSave}
                        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                        <Save size={20} />
                        Speichern & Zurück
                    </button>
                </div>
            </div>
        </div>
    );
}