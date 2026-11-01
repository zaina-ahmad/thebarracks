import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Radio, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Maximize2, 
  Minimize2, 
  Coffee, 
  Send, 
  Play, 
  Lock, 
  Headphones,
  Award,
  Sparkles,
  Flame
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

export const BunkerRoom: React.FC = () => {
  const {
    user,
    bunkerOperatives,
    radioCheck,
    triggerRadioCheck,
    confirmRadioCheck,
    perimeterBreaches,
    startBunkerSync,
    sendBunkerReaction,
    isBunkerLocked,
    toggleBunkerLock,
    activeSoundscape,
    setSoundscape,
    activeSquad,
    sendSquadMessage,
    activeSession
  } = useApp();

  const [syncMinutes, setSyncMinutes] = useState(50);
  const [syncObjective, setSyncObjective] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [intercomText, setIntercomText] = useState('');

  const quickPings = [
    { label: 'Holding the Line', text: 'Workstation perimeter secured. Deep work locked in. 🫡' },
    { label: '3m Tactical Water', text: 'Taking 3-minute tactical hydration break. Returning to station immediately. 💧' },
    { label: 'Radio Silence', text: 'Entering high-intensity proof derivation. Requesting radio silence. 🤫' },
    { label: 'Objective Neutralized', text: 'Problem set neutralized! Re-arming for next wave. 🎯' },
  ];

  const handleSendIntercom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intercomText.trim()) return;
    sendSquadMessage(intercomText.trim());
    setIntercomText('');
  };

  const handleStartSync = (e: React.FormEvent) => {
    e.preventDefault();
    const finalObjective = syncObjective.trim() || 'Synchronized Platoon Combat Block';
    startBunkerSync(finalObjective, syncMinutes);
    setShowSyncModal(false);
    setSyncObjective('');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-6 animate-fade-in ${isBunkerLocked ? 'fixed inset-0 z-50 bg-[#070a0d] p-6 overflow-y-auto' : ''}`}>
      {/* Bunker Command Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-lg font-mono font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              The Bunker // Tactical Study War Room
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              AIR-GAP SECURED
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Real-time co-working bunker for {activeSquad?.name || 'Vanguard Squad'}. Hold your focus perimeter, confirm radio checks, and prevent squad AWOLs.
          </p>
        </div>

        {/* Bunker Quick Tactical Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Radio Check Trigger Test */}
          <button
            onClick={triggerRadioCheck}
            disabled={radioCheck?.active}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 border ${
              radioCheck?.active
                ? 'bg-amber-950 text-amber-400 border-amber-800 cursor-not-allowed animate-pulse'
                : 'bg-slate-950 hover:bg-slate-850 text-slate-300 border-slate-700 hover:border-amber-500'
            }`}
            title="Initiate a 45-second squad accountability radio check"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Radio Check</span>
          </button>

          {/* Synchronized Squad Deployment */}
          <button
            onClick={() => setShowSyncModal(true)}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Squad Sync</span>
          </button>

          {/* Bunker Lock (Fullscreen / WakeLock) */}
          <button
            onClick={toggleBunkerLock}
            className={`p-2 rounded-lg text-xs font-mono border transition ${
              isBunkerLocked
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_12px_#06b6d4]'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title={isBunkerLocked ? 'Exit Bunker Lock Fullscreen' : 'Engage Bunker Fullscreen Lock (Screen Kept Awake)'}
          >
            {isBunkerLocked ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Emergency Radio Check HUD Banner */}
      {radioCheck && radioCheck.active && (
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-950 to-amber-950/90 border-2 border-amber-500 rounded-2xl p-6 shadow-[0_0_35px_rgba(245,158,11,0.25)] animate-pulse space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Radio className="w-6 h-6 text-amber-400 animate-spin" />
                <h2 className="text-base sm:text-lg font-mono font-black uppercase text-amber-300 tracking-wider">
                  ⚠️ RADIO CHECK // FOCUS ACCOUNTABILITY PING
                </h2>
              </div>
              <p className="text-xs text-slate-300 font-sans max-w-xl leading-relaxed">
                Operative <strong className="text-emerald-400">{user.callsign}</strong>, confirm active workstation presence and perimeter defense.
                Failure to respond within the countdown triggers an automatic AWOL incident dispatch to your squad.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center font-mono">
                <div className="text-xs text-slate-400 uppercase">Window Closes In:</div>
                <div className="text-3xl font-black text-amber-400">{radioCheck.timeRemainingSeconds}s</div>
              </div>

              <button
                onClick={confirmRadioCheck}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] transition transform hover:scale-105 flex items-center gap-2"
              >
                <span>🫡 CONFIRM ON TARGET (+25 XP)</span>
              </button>
            </div>
          </div>

          {/* Countdown Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-amber-900">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_#f59e0b]"
              style={{ width: `${(radioCheck.timeRemainingSeconds / 45) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Operative Workstations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Active Bunker Workstations ({bunkerOperatives.length})
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Perimeter Breaches: <strong className="text-amber-400">{perimeterBreaches}</strong> detected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bunkerOperatives.map(op => {
            const isMe = op.uid === user.uid;
            const progress = Math.min(100, Math.round((op.elapsedSeconds / Math.max(1, op.targetSeconds)) * 100));

            return (
              <div
                key={op.uid}
                className={`rounded-2xl border p-5 shadow-xl transition flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isMe
                    ? 'bg-slate-900/95 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Workstation Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={op.avatar}
                        alt={op.callsign}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${
                        op.focusShield === 'active' ? 'bg-emerald-400 animate-ping' :
                        op.focusShield === 'radio_check' ? 'bg-amber-400 animate-bounce' : 'bg-rose-500'
                      }`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-slate-100">
                          {op.callsign}
                        </span>
                        {isMe && (
                          <span className="text-[9px] font-mono px-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {op.role} • {op.rank}
                      </div>
                    </div>
                  </div>

                  {/* Focus Shield Status Badge */}
                  <div className={`px-2 py-1 rounded text-[10px] font-mono font-bold border flex items-center gap-1 ${
                    op.focusShield === 'active' 
                      ? 'bg-emerald-950/80 border-emerald-600 text-emerald-400'
                      : op.focusShield === 'radio_check'
                      ? 'bg-amber-950 border-amber-600 text-amber-300 animate-pulse'
                      : 'bg-rose-950 border-rose-600 text-rose-400'
                  }`}>
                    <Shield className="w-3 h-3" />
                    <span>
                      {op.focusShield === 'active' ? 'SHIELD 100%' : op.focusShield === 'radio_check' ? 'RADIO CHECK' : 'BREACH / AWOL'}
                    </span>
                  </div>
                </div>

                {/* Workstation Live Mission */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center justify-between">
                    <span>Current Focus Objective</span>
                    <span className="text-emerald-400 font-bold">{progress}%</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-slate-200 line-clamp-2">
                    "{op.objective}"
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        op.focusShield === 'breached' ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-0.5">
                    <span>Elapsed: {formatTimer(op.elapsedSeconds)}</span>
                    <span>Target: {Math.floor(op.targetSeconds / 60)}m</span>
                  </div>
                </div>

                {/* Direct Comrades Interactions & Reactions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    {[
                      { emoji: '🫡', label: 'Salute' },
                      { emoji: '⚡', label: 'Overclock' },
                      { emoji: '☕', label: 'Coffee' },
                      { emoji: '🎯', label: 'On Target' },
                    ].map(({ emoji, label }) => (
                      <button
                        key={emoji}
                        onClick={() => sendBunkerReaction(op.uid, emoji)}
                        className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs hover:border-slate-700 transition"
                        title={label}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Reactions Display */}
                  {op.reactions && op.reactions.length > 0 && (
                    <div className="flex items-center -space-x-1">
                      {op.reactions.map(r => (
                        <span
                          key={r.id}
                          className="px-1.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[11px] shadow animate-fade-in"
                          title={`From ${r.from}`}
                        >
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bunker Intercom & Tactical Audio Controls Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bunker Intercom Radio Broadcast */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Bunker Intercom Radio
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              CHANNEL: SQUAD INTERNAL
            </span>
          </div>

          {/* Quick Tactical Preset Transmissions */}
          <div className="flex flex-wrap gap-2">
            {quickPings.map(q => (
              <button
                key={q.label}
                type="button"
                onClick={() => sendSquadMessage(q.text)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-emerald-300 hover:border-emerald-500/60 transition"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Custom Message Input */}
          <form onSubmit={handleSendIntercom} className="flex gap-2">
            <input
              type="text"
              placeholder="Transmit message across the bunker..."
              value={intercomText}
              onChange={e => setIntercomText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Transmit
            </button>
          </form>
        </div>

        {/* Tactical Soundscape Frequency Tuner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Bunker Ambiance Shield
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              {activeSoundscape ? 'ENGAGED' : 'OFF'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'bunker_hum', name: 'Bunker Ambiance' },
              { id: 'gamma_40hz', name: '40Hz Gamma Focus' },
              { id: 'rain', name: 'Tactical Rain' },
              { id: 'radio_static', name: 'Radio Static' },
            ].map(snd => (
              <button
                key={snd.id}
                onClick={() => setSoundscape(snd.id as any)}
                className={`p-2.5 rounded-xl border text-left transition font-mono ${
                  activeSoundscape === snd.id
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold truncate">{snd.name}</div>
              </button>
            ))}
          </div>

          {activeSoundscape && (
            <button
              onClick={() => setSoundscape(null)}
              className="w-full py-1.5 text-xs font-mono text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 rounded-lg transition"
            >
              Mute Ambiance
            </button>
          )}
        </div>
      </div>

      {/* Synchronized Squad Deployment Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/80 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-100">
                  Synchronize Platoon Combat Deployment
                </h2>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Lock down all bunker workstations simultaneously. All squadmates will sync to this deployment block and take tactical breaks together.
            </p>

            <form onSubmit={handleStartSync} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Synchronized Mission Objective
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Wave 2: Joint 50-Min Focus Op"
                  value={syncObjective}
                  onChange={e => setSyncObjective(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Deployment Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[25, 50, 90].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSyncMinutes(mins)}
                      className={`py-2 text-xs font-mono font-bold rounded-lg border text-center transition ${
                        syncMinutes === mins
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSyncModal(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
                >
                  Launch Squad Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
