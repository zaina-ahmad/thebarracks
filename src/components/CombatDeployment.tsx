import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Headphones, 
  Shield, 
  Target, 
  Users, 
  AlertCircle, 
  Award,
  Zap,
  Volume2
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

export const CombatDeployment: React.FC = () => {
  const { 
    user, 
    activeSession, 
    startSession, 
    pauseSession, 
    resumeSession, 
    finishSession, 
    cancelSession, 
    activeSquad, 
    armoryTasks,
    activeSoundscape,
    setSoundscape 
  } = useApp();

  // Launcher state when not in session
  const [objectiveInput, setObjectiveInput] = useState('');
  const [sessionMode, setSessionMode] = useState<'pomodoro' | 'deep_work' | 'stopwatch'>('deep_work');
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Active session tools
  const [interceptions, setInterceptions] = useState<{ id: string; text: string; time: string }[]>([]);
  const [newInterceptionText, setNewInterceptionText] = useState('');
  const [debriefNotes, setDebriefNotes] = useState('');
  const [showDebriefModal, setShowDebriefModal] = useState(false);

  // Preset time selections
  const presetTimes = [
    { label: '25m Pomodoro', minutes: 25, mode: 'pomodoro' as const },
    { label: '50m Deep Work', minutes: 50, mode: 'deep_work' as const },
    { label: '90m Combat Recon', minutes: 90, mode: 'deep_work' as const },
    { label: 'Open Stopwatch', minutes: 0, mode: 'stopwatch' as const },
  ];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const finalObjective = objectiveInput.trim() || 'Tactical Deep Work Session';
    startSession(finalObjective, sessionMode, durationMinutes, activeSquad?.id);
  };

  const handleSelectArmoryTask = (taskId: string) => {
    const task = armoryTasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskId(taskId);
      setObjectiveInput(task.title);
      setDurationMinutes(task.estimatedMinutes);
    }
  };

  const handleLogInterception = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterceptionText.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setInterceptions(prev => [
      { id: Date.now().toString(), text: newInterceptionText.trim(), time: timeStr },
      ...prev,
    ]);
    setNewInterceptionText('');
    tacticalAudio.playClick();
  };

  // Timer calculations
  const elapsed = activeSession ? activeSession.elapsedSeconds : 0;
  const targetSeconds = activeSession ? activeSession.targetMinutes * 60 : durationMinutes * 60;
  const isStopwatch = activeSession?.mode === 'stopwatch';
  const remainingSeconds = Math.max(0, targetSeconds - elapsed);

  const displaySeconds = isStopwatch ? elapsed : remainingSeconds;
  const displayMins = Math.floor(displaySeconds / 60);
  const displaySecs = displaySeconds % 60;
  const formattedTime = `${String(displayMins).padStart(2, '0')}:${String(displaySecs).padStart(2, '0')}`;

  const progressPercent = isStopwatch 
    ? Math.min(100, (elapsed / 3600) * 100) 
    : Math.min(100, Math.round((elapsed / Math.max(1, targetSeconds)) * 100));

  // Operatives in bunker
  const bunkerOperatives = (activeSquad?.members || []).filter(m => m.status === 'in-session');

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {!activeSession ? (
        /* Tactical Mission Briefing & Launcher */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Mission Setup */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-slate-100">
                  Combat Deployment Console
                </h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                STATUS: READY
              </span>
            </div>

            <form onSubmit={handleStart} className="space-y-5">
              {/* Objective Input */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
                  Primary Mission Objective <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Chemistry Problem Set 4: Reaction Kinetics"
                    value={objectiveInput}
                    onChange={e => setObjectiveInput(e.target.value)}
                    className="w-full px-4 py-3 text-sm font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Mode & Duration Preset Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
                  Deployment Protocol & Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {presetTimes.map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setDurationMinutes(preset.minutes);
                        setSessionMode(preset.mode);
                      }}
                      className={`p-3 rounded-xl border text-center transition font-mono ${
                        durationMinutes === preset.minutes && sessionMode === preset.mode
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-sm font-bold">{preset.minutes > 0 ? `${preset.minutes}m` : '∞'}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{preset.label.split(' ')[1]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stash from Armory */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Armory Quick-Equip (Optional)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Sync objective with tactical checklist
                  </span>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {armoryTasks.filter(t => !t.completed).map(task => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => handleSelectArmoryTask(task.id)}
                      className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between text-xs transition ${
                        selectedTaskId === task.id
                          ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate pr-2">{task.title}</span>
                      <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono">
                        <span className="text-amber-400">{task.estimatedMinutes}m</span>
                        <span className="px-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {task.priority.replace('_', ' ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Launch Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition transform hover:scale-[1.01]"
              >
                <Play className="w-4 h-4 fill-current" /> Engage Deployment ({durationMinutes} Minutes)
              </button>
            </form>
          </div>

          {/* Squad Bunker Info & Tactical Soundscapes */}
          <div className="space-y-6">
            {/* Squad Virtual Bunker Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Bunker Ops // Deployed Peers
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {bunkerOperatives.length} ACTIVE
                </span>
              </div>

              {bunkerOperatives.length > 0 ? (
                <div className="space-y-2.5">
                  {bunkerOperatives.map(op => (
                    <div key={op.uid} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-3">
                      <div className="relative">
                        <img src={op.avatar} alt={op.callsign} className="w-8 h-8 rounded-full object-cover" />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono font-bold text-slate-200 truncate">
                          {op.callsign}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {op.currentObjective || 'Active Study Mission'}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {op.minutesStudiedToday}m today
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">
                  No squadmates currently in the bunker. Deploy now to lead the charge!
                </p>
              )}
            </div>

            {/* Tactical Focus Soundscapes Selector */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Headphones className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Synthesized Soundscapes
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rain', name: 'Tactical Rain' },
                  { id: 'bunker_hum', name: 'Bunker Ambiance' },
                  { id: 'gamma_40hz', name: '40Hz Gamma' },
                  { id: 'radio_static', name: 'Military Static' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSoundscape(item.id as any)}
                    className={`py-2 px-3 text-xs font-mono rounded-lg border text-left flex items-center justify-between transition ${
                      activeSoundscape === item.id 
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.name}</span>
                    {activeSoundscape === item.id && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Active Combat Study Zone */
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-tactical-950 to-slate-950 border border-emerald-500/30 p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] text-center">
            {/* Background HUD Scanlines */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            {/* Tactical Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/80 text-emerald-400 text-xs font-mono font-bold mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>LIVE COMBAT FOCUS // {activeSession.mode.toUpperCase().replace('_', ' ')}</span>
            </div>

            {/* Active Objective */}
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 max-w-2xl mx-auto mb-8">
              "{activeSession.objective}"
            </h1>

            {/* Tactical Circular Timer HUD */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
              {/* SVG Ring Progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  className="stroke-emerald-500 transition-all duration-1000 ease-linear shadow-[0_0_20px_#10b981]"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 140}
                  strokeDashoffset={(2 * Math.PI * 140) * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Time Display Centered */}
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-slate-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {formattedTime}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mt-2">
                  {isStopwatch ? 'ELAPSED COMBAT TIME' : `${Math.floor(activeSession.elapsedSeconds / 60)}m Logged • ${progressPercent}%`}
                </span>
                {activeSession.isPaused && (
                  <span className="mt-2 text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 animate-bounce">
                    TIMER PAUSED
                  </span>
                )}
              </div>
            </div>

            {/* Tactical Action Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {activeSession.isPaused ? (
                <button
                  onClick={resumeSession}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
                >
                  <Play className="w-4 h-4 fill-current" /> Resume Ops
                </button>
              ) : (
                <button
                  onClick={pauseSession}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-700 transition"
                >
                  <Pause className="w-4 h-4" /> Tactical Pause
                </button>
              )}

              <button
                onClick={() => setShowDebriefModal(true)}
                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition"
              >
                <CheckCircle2 className="w-4 h-4" /> Mission Success // Finish
              </button>

              <button
                onClick={() => {
                  if (confirm('Abort active combat deployment? Recorded minutes will not be credited.')) {
                    cancelSession();
                  }
                }}
                className="px-4 py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-400 font-mono text-xs font-semibold uppercase border border-rose-900/60 transition"
              >
                Abort
              </button>
            </div>
          </div>

          {/* Tactical Bottom Grid: Hostile Interception Deflector + Soundscape Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hostile Interception Deflector (Distraction Logger) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Distraction Deflector // Interceptions Log
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  {interceptions.length} NEUTRALIZED
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Random thought or urge to check your phone? Write it down here to offload working memory without leaving the zone.
              </p>

              <form onSubmit={handleLogInterception} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Look up flight tickets, reply to text..."
                  value={newInterceptionText}
                  onChange={e => setNewInterceptionText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 rounded-lg transition"
                >
                  Neutralize
                </button>
              </form>

              {interceptions.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {interceptions.map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-2 rounded bg-slate-950 text-xs font-mono text-slate-300 border border-slate-800/80"
                    >
                      <span className="truncate pr-2 line-through text-slate-400">{item.text}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tactical Comms Broadcast */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Bunker Soundscape Frequency
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  {activeSoundscape ? 'TRANSMITTING' : 'MUTED'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'rain', label: 'Tactical Rain', desc: 'Focus acoustic curtain' },
                  { id: 'bunker_hum', label: 'Bunker Ambiance', desc: 'Sub-bass drone' },
                  { id: 'gamma_40hz', label: '40Hz Gamma', desc: 'Neuro-sync oscillation' },
                  { id: 'radio_static', label: 'Radio Static', desc: 'Squelch warmth' },
                ].map(snd => (
                  <button
                    key={snd.id}
                    onClick={() => setSoundscape(snd.id as any)}
                    className={`p-3 rounded-xl border text-left transition font-mono ${
                      activeSoundscape === snd.id
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{snd.label}</div>
                    <div className="text-[10px] text-slate-500">{snd.desc}</div>
                  </button>
                ))}
              </div>

              {activeSoundscape && (
                <button
                  onClick={() => setSoundscape(null)}
                  className="w-full py-2 text-xs font-mono text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 rounded-lg transition"
                >
                  Silence Soundscape
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mission Debrief & Success Modal */}
      {showDebriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/80 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_#10b981]">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-mono font-black text-slate-100 uppercase tracking-wider">
                Mission Success // Debrief
              </h2>
              <p className="text-xs text-slate-400">
                You logged <strong className="text-emerald-400">{Math.max(1, Math.round((activeSession?.elapsedSeconds || 0) / 60))} minutes</strong> of high-agency deep study.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated XP Bounty:</span>
              <div className="text-2xl font-mono font-black text-emerald-400">
                +{Math.max(1, Math.round((activeSession?.elapsedSeconds || 0) / 60)) * 5 + 25} XP
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-2">
                Mission Debrief Intel Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="What was conquered? Any notes for the platoon SITREP?"
                value={debriefNotes}
                onChange={e => setDebriefNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDebriefModal(false)}
                className="flex-1 py-2.5 text-xs font-mono text-slate-400 hover:bg-slate-800 rounded-xl transition"
              >
                Back to Session
              </button>
              <button
                type="button"
                onClick={() => {
                  finishSession(debriefNotes);
                  setShowDebriefModal(false);
                  setDebriefNotes('');
                }}
                className="flex-1 py-2.5 text-xs font-mono font-bold uppercase rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
              >
                Submit Intel & Victory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
