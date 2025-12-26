import Sidebar from "@/components/Sidebar";
import { getTodayLog, getTasks, updateDailyLog, addTask, toggleTask } from "@/actions/uni-actions";
import { CheckCircle2, AlertCircle, Brain, Briefcase, Clock, Zap, Network, Plus } from "lucide-react";

export default async function UniPage() {
  // Daten vom Server holen
  const log = await getTodayLog();
  const { critical, important } = await getTasks();

  return (
    // Hintergrund: Helles Anthrazit (#27272a)
    <div className="flex h-screen bg-[#27272a] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* SIDEBAR */}
      <div className="relative z-50 h-full flex-shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col h-full relative overflow-y-auto p-6 md:p-8 gap-8">
        
        {/* BACKGROUND EFFECTS */}
        <div className="fixed top-0 left-0 right-0 h-full pointer-events-none overflow-hidden z-0 bg-[#27272a]">
             {/* Verlauf angepasst */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#3f3f46] via-[#27272a] to-[#18181b]"></div>
             <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-10 pb-20">
            
            {/* --- HEADER --- */}
            <header className="border-b border-white/10 pb-8">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                  Career & Skill Cockpit <Briefcase className="text-indigo-400" />
              </h1>
              <p className="text-slate-400 mb-8">Output is the only metric that counts. No Excuses.</p>
              
              {/* MAIN FOCUS FORM */}
              <form action={updateDailyLog} className="bg-[#27272a]/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6 items-end shadow-xl">
                <input type="hidden" name="intent" value="mainFocus" />
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Main Focus Today</label>
                  <input 
                    name="mainTask"
                    defaultValue={log?.mainTask || ''}
                    placeholder="Was ist die EINE Sache heute?" 
                    className="w-full bg-[#18181b] border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
                <div className="w-full md:w-48">
                  <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Ziel: Deep Work</label>
                  <div className="relative">
                    <input 
                      name="goalDeepWorkMinutes"
                      type="number"
                      defaultValue={log?.goalDeepWorkMinutes || 120}
                      className="w-full bg-[#18181b] border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors pl-10"
                    />
                    <span className="absolute right-4 top-3 text-slate-500 text-sm">min</span>
                    <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-500/20 w-full md:w-auto hover:scale-105 active:scale-95">
                  Set Focus
                </button>
              </form>
            </header>

            {/* --- SECTION 1: DEEP WORK TRACKER --- */}
            <section className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#27272a]/30 backdrop-blur-md border border-white/5 rounded-[24px] p-6 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-6 text-emerald-400">
                        <Zap className="w-5 h-5" />
                        <h2 className="font-bold tracking-wide text-white">DEEP WORK LOG</h2>
                    </div>
                    <form action={updateDailyLog} className="space-y-6">
                        <input type="hidden" name="intent" value="deepWork" />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-2">Ist-Zeit (Min)</label>
                                <input name="actualDeepWorkMinutes" type="number" defaultValue={log?.actualDeepWorkMinutes || 0} className="w-full bg-[#18181b]/50 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-2">Focus Level (1-5)</label>
                                <input name="focusLevel" type="number" max="5" defaultValue={log?.focusLevel || 0} className="w-full bg-[#18181b]/50 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-[#18181b]/50 rounded-xl border border-white/5">
                            <input name="outputProduced" type="checkbox" defaultChecked={log?.outputProduced} className="mt-1 w-5 h-5 accent-emerald-500" />
                            <div>
                                <span className="text-white font-medium block">Tangibler Output erzeugt?</span>
                                <span className="text-xs text-slate-500">Code, Text, Analyse (Kein reines "Lesen")</span>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-[#18181b] hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-300 rounded-xl transition-all font-medium border border-white/5 hover:border-emerald-500/30">
                            Update Log
                        </button>
                    </form>
                </div>

                {/* --- SECTION 2: TRANSLATOR SKILL --- */}
                <div className="bg-[#27272a]/30 backdrop-blur-md border border-white/5 rounded-[24px] p-6 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-6 text-purple-400">
                        <Briefcase className="w-5 h-5" />
                        <h2 className="font-bold tracking-wide text-white">TRANSLATOR SKILL</h2>
                    </div>
                    <form action={updateDailyLog} className="space-y-4">
                        <input type="hidden" name="intent" value="translator" />
                        <input name="technicalConcept" placeholder="Technisches Konzept (z.B. API, Docker)" defaultValue={log?.technicalConcept || ''} className="w-full bg-[#18181b]/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-purple-500 focus:outline-none" />
                        <textarea name="businessExplanation" placeholder="Erklärung für CEO (max 2 Sätze, Business Value)" defaultValue={log?.businessExplanation || ''} className="w-full bg-[#18181b]/50 border border-white/10 rounded-lg p-3 text-sm text-white h-24 resize-none focus:border-purple-500 focus:outline-none" />
                        
                        <div className="pt-4 border-t border-white/5 mt-4">
                            <label className="text-xs text-purple-400 uppercase block mb-2">Verständnis Check</label>
                            <div className="flex gap-2">
                                <input name="topic" placeholder="Gelerntes Thema heute" defaultValue={log?.topic || ''} className="flex-1 bg-[#18181b]/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-purple-500 focus:outline-none" />
                                <div className="flex items-center gap-2 px-3 bg-[#18181b]/50 border border-white/10 rounded-lg">
                                    <input name="canExplain" type="checkbox" defaultChecked={log?.canExplain} className="accent-purple-500 w-4 h-4" />
                                    <span className="text-xs text-slate-400 whitespace-nowrap">Erklärbar?</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-[#18181b] hover:bg-purple-600/20 hover:text-purple-400 text-slate-300 rounded-xl transition-all font-medium border border-white/5 hover:border-purple-500/30">
                            Save Learning
                        </button>
                    </form>
                </div>
            </section>

            {/* --- SECTION 3: TASKS --- */}
            <section className="grid md:grid-cols-2 gap-12 pt-4">
                {/* LINKS: KRITISCH */}
                <div>
                    <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-sm">
                        <AlertCircle className="w-4 h-4" /> Kritisch (Deadline ≤ 7d)
                    </h3>
                    <div className="space-y-3">
                        {/* FIX: (task: any) hinzugefügt, um Vercel Fehler zu beheben */}
                        {critical.map((task: any) => (
                            <form key={task.id} action={toggleTask.bind(null, task.id, !task.isDone)} className="flex items-center gap-3 group bg-[#18181b]/40 p-3 rounded-xl border border-transparent hover:border-rose-500/20 transition-all">
                                <button className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.isDone ? 'bg-rose-500 border-rose-500' : 'border-slate-600 hover:border-rose-400'}`}>
                                    {task.isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </button>
                                <span className={`${task.isDone ? 'text-slate-600 line-through' : 'text-slate-300'} text-sm font-medium`}>{task.title}</span>
                            </form>
                        ))}
                        <form action={addTask} className="mt-4 flex gap-2">
                            <input name="title" placeholder="+ Add Critical Task" className="bg-transparent border-b border-white/10 text-sm py-2 w-full focus:outline-none focus:border-rose-500 text-white transition-colors placeholder:text-slate-600" />
                            <input type="hidden" name="priority" value="CRITICAL" />
                            <button type="submit" className="text-slate-500 hover:text-rose-400"><Plus size={18} /></button>
                        </form>
                    </div>
                </div>

                {/* RECHTS: WICHTIG */}
                <div>
                    <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-sm">
                        <Brain className="w-4 h-4" /> Wichtig (Strategie/Backlog)
                    </h3>
                    <div className="space-y-3">
                        {/* FIX: (task: any) hinzugefügt, um Vercel Fehler zu beheben */}
                        {important.map((task: any) => (
                            <form key={task.id} action={toggleTask.bind(null, task.id, !task.isDone)} className="flex items-center gap-3 group bg-[#18181b]/40 p-3 rounded-xl border border-transparent hover:border-blue-500/20 transition-all">
                                 <button className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.isDone ? 'bg-blue-600 border-blue-600' : 'border-slate-600 hover:border-blue-400'}`}>
                                    {task.isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </button>
                                <span className={`${task.isDone ? 'text-slate-600 line-through' : 'text-slate-300'} text-sm font-medium`}>{task.title}</span>
                            </form>
                        ))}
                        <form action={addTask} className="mt-4 flex gap-2">
                            <input name="title" placeholder="+ Add Important Task" className="bg-transparent border-b border-white/10 text-sm py-2 w-full focus:outline-none focus:border-blue-500 text-white transition-colors placeholder:text-slate-600" />
                            <input type="hidden" name="priority" value="IMPORTANT" />
                            <button type="submit" className="text-slate-500 hover:text-blue-400"><Plus size={18} /></button>
                        </form>
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: REALITY CHECK --- */}
            <section className="border-t border-white/10 pt-8">
                 <div className="flex items-center gap-3 mb-6 text-orange-400">
                    <Network className="w-5 h-5" />
                    <h2 className="font-bold tracking-wide text-white">REALITY CHECK & NETWORK</h2>
                </div>
                <form action={updateDailyLog} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input type="hidden" name="intent" value="realityCheck" />
                    <div className="bg-[#27272a]/30 p-4 rounded-xl border border-white/5 flex items-center justify-between hover:bg-[#27272a]/50 transition-colors">
                        <span className="text-sm text-slate-300">Fake Work (nur busy)?</span>
                        <input name="realityCheckBusy" type="checkbox" defaultChecked={log?.realityCheckBusy} className="w-5 h-5 accent-orange-500" />
                    </div>
                    <div className="bg-[#27272a]/30 p-4 rounded-xl border border-white/5 flex items-center justify-between hover:bg-[#27272a]/50 transition-colors">
                        <span className="text-sm text-slate-300">Schweres vermieden?</span>
                        <input name="realityCheckAvoided" type="checkbox" defaultChecked={log?.realityCheckAvoided} className="w-5 h-5 accent-orange-500" />
                    </div>
                     <button className="w-full py-2 bg-[#18181b] hover:bg-orange-500/20 hover:text-orange-400 text-slate-300 rounded-xl transition-colors border border-white/5 hover:border-orange-500/50">
                        Confirm Reality
                     </button>
                </form>
            </section>
        </div>
      </main>
    </div>
  )
}