import { getDailyQuote } from "@/lib/quotes";
import { Quote } from "lucide-react";

export default function QuoteBar() {
    const quote = getDailyQuote();

    return (
        <div className="hidden lg:flex absolute top-8 right-8 z-20 max-w-sm pointer-events-none">
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex gap-3 items-start">
                <div className="text-indigo-400 mt-1">
                    <Quote size={20} className="fill-indigo-400/20" />
                </div>
                <div>
                    <p className="text-slate-200 text-sm font-medium italic leading-relaxed">
                        "{quote.text}"
                    </p>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-2 text-right">
                        — {quote.author}
                    </p>
                </div>
            </div>
        </div>
    );
}
