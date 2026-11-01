import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Crosshair, 
  Flame, 
  Users, 
  Clock, 
  Shield, 
  Radio, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Award,
  Zap
} from 'lucide-react';
import { getRankFromXp } from '../utils/ranks';

export const RadarOverview: React.FC = () => {
  const { 
    user, 
    activeSquad, 
    squads, 
    sitreps, 
    armoryTasks, 
    activeSession, 
    startSession, 
    setActiveTab, 
    reactToSitrep 
  } = useApp();

  const [quickObjective, setQuickObjective] = useState('');
  const [quickDuration, setQuickDuration] = useState(50);
  const [selectedOperative, setSelectedOperative] = useState<any | null>(null);

  const defcon1Tasks = armoryTasks.filter(t => t.priority === 'DEFCON_1' && !t.completed);
  const activeCombatants = (activeSquad?.members || []).filter(m => m.status === 'in-session');

  const handleQuickDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    const objective = quickObjective.trim() || (defcon1Tasks.length > 0 ? defcon1Tasks[0].title : 'Deep Recon Focus Session');
    startSession(objective, 'deep_work', quickDuration, activeSquad?.id);
    setActiveTab('ops');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Readiness & Quick Deployment Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-tactical-900 to-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Readiness & Operative Status */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                COMMAND CENTER ACTIVE
              </span>
              <span className="text-xs font-mono text-slate-400">
                Platoon: <strong className="text-slate-200">{activeSquad?.name || 'Unassigned'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-display">
              Operative <span className="text-emerald-400">{user.callsign}</span>, Ready for Deployment.
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Maintain squad discipline. The Barracks radar monitors your active study ops in real-time, syncing focus intelligence across your platoon.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono text-slate-300">
                  <strong className="text-amber-400 font-bold">{user.streak}</strong> Day Streak
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-300">
                  <strong className="text-cyan-400 font-bold">{(user.totalMinutes / 60).toFixed(1)}</strong> Combat Hrs
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-slate-300">
                  <strong className="text-emerald-400 font-bold">{activeCombatants.length}</strong> Squadmates in Ops
                </span>
              </div>
            </div>
          </div>

          {/* Quick Launch Deployment Console */}
          <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-emerald-400" /> Quick Deployment
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                DEFCON 2
              </span>
            </div>

            <form onSubmit={handleQuickDeploy} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder={defcon1Tasks.length > 0 ? `Target: ${defcon1Tasks[0].title}` : 'Objective: e.g. CS210 Algorithms PSet 3'}
                  value={quickObjective}
                  onChange={e => setQuickObjective(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                {[25, 50, 90].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setQuickDuration(mins)}
                    className={`flex-1 py-1.5 text-xs font-mono font-bold rounded border transition ${
                      quickDuration === mins
                        ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Deploy Solo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('bunker')}
                  className="px-3 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 font-mono font-bold text-xs uppercase border border-emerald-500/40 flex items-center gap-1.5 transition"
                  title="Enter The Bunker War Room"
                >
                  <Shield className="w-3.5 h-3.5" /> The Bunker
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Grid: Tactical Radar Visualizer + Squad Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Tactical Radar HUD */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
                Combat Radar // Active Operatives Grid
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Live Ping: <span className="text-emerald-400 font-bold">ACTIVE</span>
            </span>
          </div>

          {/* Interactive Radar Visualizer */}
          <div className="relative w-full aspect-video max-h-80 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center overflow-hidden">
            {/* Grid scanlines & circles */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
            <div className="absolute w-72 h-72 rounded-full border border-emerald-500/20 pointer-events-none" />
            <div className="absolute w-48 h-48 rounded-full border border-emerald-500/30 pointer-events-none" />
            <div className="absolute w-24 h-24 rounded-full border border-emerald-500/40 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-emerald-500/20 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-emerald-500/20 pointer-events-none" />

            {/* Rotating radar sweep line */}
            <div 
              className="absolute inset-0 origin-center pointer-events-none animate-radar-sweep"
              style={{
                background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.25) 0deg, transparent 60deg, transparent 360deg)',
              }}
            />

            {/* Radar Operative Blips */}
            <div className="relative z-10 w-full h-full p-6">
              {/* Center Blip: User */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                onClick={() => setSelectedOperative({
                  callsign: user.callsign,
                  rank: user.rank,
                  avatar: user.avatar,
                  status: user.status,
                  currentObjective: user.currentObjective || 'Command Center Standby',
                  isMe: true,
                })}
              >
                <div className="relative">
                  <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping" />
                  <img 
                    src={user.avatar} 
                    alt={user.callsign} 
                    className="w-8 h-8 rounded-full border-2 border-emerald-400 relative z-10 shadow-[0_0_12px_#10b981]" 
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 mt-1 bg-slate-950/80 px-1.5 rounded border border-emerald-800">
                  {user.callsign} (YOU)
                </span>
              </div>

              {/* Blip 1: Ghost-9 */}
              <div 
                className="absolute top-[28%] left-[25%] flex flex-col items-center group cursor-pointer"
                onClick={() => setSelectedOperative({
                  callsign: 'Ghost-9',
                  rank: 'Lieutenant',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
                  status: 'in-session',
                  currentObjective: 'Quantum Mechanics: Wavefunctions & Schrodinger Equation',
                  minutesStudiedToday: 130,
                })}
              >
                <div className="relative">
                  <span className="absolute -inset-1 rounded-full bg-cyan-400/40 animate-ping" />
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80" 
                    alt="Ghost-9" 
                    className="w-7 h-7 rounded-full border-2 border-cyan-400 relative z-10" 
                  />
                </div>
                <span className="text-[9px] font-mono text-cyan-300 mt-1 bg-slate-950/80 px-1 rounded border border-cyan-800">
                  Ghost-9 [IN OPS]
                </span>
              </div>

              {/* Blip 2: Apex-4 */}
              <div 
                className="absolute top-[32%] right-[22%] flex flex-col items-center group cursor-pointer"
                onClick={() => setSelectedOperative({
                  callsign: 'Apex-4',
                  rank: 'Specialist',
                  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
                  status: 'in-session',
                  currentObjective: 'Thermodynamics Problem Set 5',
                  minutesStudiedToday: 45,
                })}
              >
                <div className="relative">
                  <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping" />
                  <img 
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80" 
                    alt="Apex-4" 
                    className="w-7 h-7 rounded-full border-2 border-emerald-400 relative z-10" 
                  />
                </div>
                <span className="text-[9px] font-mono text-emerald-300 mt-1 bg-slate-950/80 px-1 rounded border border-emerald-800">
                  Apex-4 [IN OPS]
                </span>
              </div>

              {/* Blip 3: Cipher-7 */}
              <div 
                className="absolute bottom-[24%] left-[32%] flex flex-col items-center group cursor-pointer"
                onClick={() => setSelectedOperative({
                  callsign: 'Cipher-7',
                  rank: 'Corporal',
                  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
                  status: 'standby',
                  currentObjective: 'Stokes Theorem & Differential Forms',
                  minutesStudiedToday: 90,
                })}
              >
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80" 
                  alt="Cipher-7" 
                  className="w-6 h-6 rounded-full border border-slate-500 opacity-80" 
                />
                <span className="text-[9px] font-mono text-slate-400 mt-1 bg-slate-950/80 px-1 rounded border border-slate-800">
                  Cipher-7 [STANDBY]
                </span>
              </div>

              {/* Blip 4: Nova-3 */}
              <div 
                className="absolute bottom-[22%] right-[30%] flex flex-col items-center group cursor-pointer"
                onClick={() => setSelectedOperative({
                  callsign: 'Nova-3',
                  rank: 'Private',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
                  status: 'online',
                  currentObjective: 'Physical Chemistry Review',
                  minutesStudiedToday: 30,
                })}
              >
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80" 
                  alt="Nova-3" 
                  className="w-6 h-6 rounded-full border border-slate-500 opacity-80" 
                />
                <span className="text-[9px] font-mono text-slate-400 mt-1 bg-slate-950/80 px-1 rounded border border-slate-800">
                  Nova-3 [READY]
                </span>
              </div>
            </div>
          </div>

          {/* Selected Operative Intel Drawer */}
          {selectedOperative && (
            <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedOperative.avatar} 
                  alt={selectedOperative.callsign} 
                  className="w-9 h-9 rounded-full object-cover border border-emerald-500" 
                />
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                    <span>{selectedOperative.callsign}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 rounded border border-emerald-800">
                      {selectedOperative.rank}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    Objective: <span className="text-slate-300 font-medium">{selectedOperative.currentObjective}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    reactToSitrep(sitreps[0]?.id || 'sitrep_1', '🫡');
                    alert(`🫡 Tactical Salute sent to ${selectedOperative.callsign}!`);
                  }}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition"
                >
                  🫡 Salute
                </button>
                <button
                  onClick={() => setSelectedOperative(null)}
                  className="text-xs text-slate-500 hover:text-slate-300 px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Active Squad Readiness Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
                Squad Status
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('squads')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
            >
              Comms <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeSquad ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-bold text-slate-100 text-sm">
                    {activeSquad.name}
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 rounded border border-cyan-800">
                    {activeSquad.callsignTag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 italic mt-0.5">
                  "{activeSquad.motto}"
                </p>
              </div>

              {/* Weekly Goal Progress */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Weekly Target:</span>
                  <span className="text-emerald-400 font-bold">
                    {activeSquad.currentWeeklyHours} / {activeSquad.weeklyGoalHours} hrs
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((activeSquad.currentWeeklyHours / activeSquad.weeklyGoalHours) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-500 text-right">
                  {Math.round((activeSquad.currentWeeklyHours / activeSquad.weeklyGoalHours) * 100)}% of squad target reached
                </div>
              </div>

              {/* Squad Members Roster */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  Platoon Roster ({activeSquad.members.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {activeSquad.members.map(member => (
                    <div 
                      key={member.uid}
                      className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <img 
                            src={member.avatar} 
                            alt={member.callsign} 
                            className="w-6 h-6 rounded-full object-cover" 
                          />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-950 ${
                            member.status === 'in-session' ? 'bg-emerald-400 animate-ping' :
                            member.status === 'standby' ? 'bg-amber-400' : 'bg-slate-500'
                          }`} />
                        </div>
                        <div>
                          <div className="font-mono font-semibold text-slate-200">
                            {member.callsign} {member.uid === user.uid && '(YOU)'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {member.role} • {member.rank}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        member.status === 'in-session' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {member.status === 'in-session' ? 'IN OPS' : member.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-slate-400">You are currently not deployed to any platoon squad.</p>
              <button
                onClick={() => setActiveTab('squads')}
                className="px-4 py-2 text-xs font-mono font-bold uppercase rounded bg-emerald-500 text-slate-950"
              >
                Join a Squad
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: DEFCON 1 Mission Alert & Live SITREP Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DEFCON 1 Armory Alert */}
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-rose-300">
                DEFCON 1 // Critical Objectives ({defcon1Tasks.length})
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('armory')}
              className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
            >
              The Armory <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {defcon1Tasks.length > 0 ? (
            <div className="space-y-2">
              {defcon1Tasks.slice(0, 3).map(task => (
                <div 
                  key={task.id} 
                  className="p-3 rounded-lg bg-slate-950 border border-rose-900/30 flex items-start justify-between gap-3 group hover:border-rose-500/50 transition"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">
                      {task.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {task.description || 'Critical tactical mission deadline.'}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-mono">
                      <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        DEFCON 1
                      </span>
                      <span className="text-slate-400">{task.subject}</span>
                      <span className="text-emerald-400">+{task.xpReward} XP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      startSession(task.title, 'deep_work', task.estimatedMinutes, activeSquad?.id);
                      setActiveTab('ops');
                    }}
                    className="shrink-0 px-2.5 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 transition"
                  >
                    Deploy
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
              No DEFCON 1 critical threats detected. All perimeter targets neutralized!
            </div>
          )}
        </div>

        {/* Live Sitrep Mini-Ticker */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
                Live Sitrep Stream
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('sitrep')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
            >
              Full Sitreps <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {sitreps.slice(0, 3).map(rep => (
              <div 
                key={rep.id} 
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3"
              >
                <img 
                  src={rep.userAvatar} 
                  alt={rep.userCallsign} 
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200 truncate">
                      {rep.userCallsign}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {Math.max(1, Math.round((Date.now() - rep.timestamp) / 60000))}m ago
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                    {rep.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {rep.detail}
                  </div>
                </div>

                <button
                  onClick={() => reactToSitrep(rep.id, '🫡')}
                  className="shrink-0 p-1 rounded hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-100"
                  title="Send Salute"
                >
                  🫡
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
