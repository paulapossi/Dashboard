"use client";

import Link from "next/link";
import { LayoutDashboard, GraduationCap, Dumbbell, BookOpen, Leaf, Heart, Brain, Settings, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/" },
        { icon: GraduationCap, label: "Uni", href: "/uni" },
        { icon: Dumbbell, label: "Sport", href: "/sport" },
        { icon: BookOpen, label: "Lesen", href: "/lesen" },

        // --- WICHTIGE ÄNDERUNG HIER ---
        // Vorher: href: "/food"  --> Jetzt: href: "/ernaehrung"
        { icon: Leaf, label: "Ernährung", href: "/ernaehrung" },

        { icon: Heart, label: "Paula", href: "/paula" },
        { icon: Brain, label: "Mental", href: "/mental" },
    ];

    return (
        <aside className="hidden xl:flex flex-col w-[260px] h-full bg-[#0f1115] border-r border-slate-800 p-6">

            {/* Logo Area */}
            <div className="mb-10 px-2">
                <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Sidebar
                </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                                ${isActive
                                        ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/10 text-cyan-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                        : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-white"} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Area */}
            <div className="mt-auto pt-6 border-t border-slate-800 space-y-2">
                <Link href="/settings">
                    <div className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-white cursor-pointer transition-colors rounded-2xl hover:bg-slate-800/50">
                        <Settings size={22} />
                        <span className="font-medium">Settings</span>
                    </div>
                </Link>
                
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 cursor-pointer transition-colors rounded-2xl hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LogOut size={22} />
                    <span className="font-medium">{isLoggingOut ? "Abmelden..." : "Abmelden"}</span>
                </button>
            </div>
        </aside>
    );
}