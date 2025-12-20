"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CalendarWidget from "@/components/dashboard/CalendarWidget";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full max-w-4xl flex items-center gap-4 mb-10">
          <Link href="/" className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition">
            <ArrowLeft size={24} className="text-gray-700"/>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Mein Kalender</h1>
        </div>

        {/* Inhalt */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="scale-110 origin-top">
                <CalendarWidget />
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md">
                <h2 className="text-xl font-bold mb-4">Agenda</h2>
                <p className="text-gray-500">Hier kommen später deine Termine hin.</p>
                <div className="mt-6 space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                        <div className="font-bold text-blue-900">Meeting mit Team</div>
                        <div className="text-sm text-blue-600">14:00 Uhr</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}