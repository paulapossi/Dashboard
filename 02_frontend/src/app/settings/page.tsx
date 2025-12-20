"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Daten laden
    useEffect(() => {
        const savedData = localStorage.getItem("life-os-data");
        if (savedData) {
            setCategories(JSON.parse(savedData));
        }
        setIsLoaded(true);
    }, []);

    // 2. Änderungen speichern
    const saveChanges = () => {
        localStorage.setItem("life-os-data", JSON.stringify(categories));
        router.push("/"); // Zurück zum Dashboard
    };

    // Funktion: Label ändern
    const updateLabel = (id: string, newLabel: string) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, label: newLabel } : c));
    };

    // Funktion: Kategorie löschen
    const deleteCategory = (id: string) => {
        if (confirm("Wirklich löschen?")) {
            setCategories(prev => prev.filter(c => c.id !== id));
        }
    };

    // Funktion: Neue Kategorie
    const addCategory = () => {
        const newId = `cat-${Date.now()}`; // Zufällige ID generieren
        const newCat = { id: newId, label: "Neu", progress: 0 };
        setCategories([...categories, newCat]);
    };

    // Funktion: Alles zurücksetzen (Notfall-Button)
    const resetAll = () => {
        if (confirm("Alles auf Anfang zurücksetzen?")) {
            localStorage.removeItem("life-os-data");
            window.location.href = "/";
        }
    }

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-6 flex justify-center">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Einstellungen</h1>
                </div>

                {/* Liste der Kategorien */}
                <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-8 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-500 mb-4 uppercase tracking-wider">Deine Kategorien</h2>

                    {categories.map((cat, index) => (
                        <div key={cat.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">

                            {/* Nummer */}
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full font-bold text-xs">
                                {index + 1}
                            </div>

                            {/* Eingabefeld für den Namen */}
                            <input
                                type="text"
                                value={cat.label}
                                onChange={(e) => updateLabel(cat.id, e.target.value)}
                                className="flex-1 bg-transparent font-bold text-gray-800 text-lg outline-none focus:text-blue-600 placeholder-gray-300"
                                placeholder="Name der Kategorie..."
                            />

                            {/* Löschen Button */}
                            <button
                                onClick={() => deleteCategory(cat.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Löschen"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}

                    {/* Neue Kategorie hinzufügen */}
                    <button
                        onClick={addCategory}
                        className="w-full py-4 mt-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                        <Plus size={20} />
                        Kategorie hinzufügen
                    </button>

                </div>

                {/* Aktionsleiste unten */}
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={resetAll}
                        className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold rounded-xl transition flex items-center gap-2"
                    >
                        <RefreshCw size={20} /> Reset
                    </button>

                    <button
                        onClick={saveChanges}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        Änderungen speichern
                    </button>
                </div>

            </div>
        </div>
    );
}