import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  Award, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Edit2, 
  Check, 
  User, 
  Medal, 
  Zap, 
  Target
} from 'lucide-react';
import { RANKS, BADGES, getRankFromXp, getNextRankProgress } from '../utils/ranks';

export const PersonnelDossier: React.FC = () => {
  const { user, updateUserCallsign, squads } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [callsignInput, setCallsignInput] = useState(user.callsign);
  const [bioInput, setBioInput] = useState(user.bio || '');

  const rankInfo = getRankFromXp(user.xp);
  const rankProgress = getNextRankProgress(user.xp);
  const userSquad = squads.find(s => s.id === user.activeSquadId);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callsignInput.trim()) return;
    updateUserCallsign(callsignInput.trim(), bioInput.trim());
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Dossier Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.callsign}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-800 shadow">
                {rankInfo.abbr}
              </span>
            </div>

            <div className="space-y-1">
              {!isEditing ? (
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-mono font-black text-slate-100">
                      {user.callsign}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition"
                      title="Edit Operative Callsign"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-mono font-bold ${rankInfo.color}`}>
                      {rankInfo.name} ({rankInfo.abbr})
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-slate-400">
                      Platoon: <strong className="text-slate-200">{userSquad ? userSquad.name : 'Independent'}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-2 max-w-lg leading-relaxed">
                    {user.bio || 'Pre-Med & STEM operative dedicated to deep focus study ops.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400">
                      Callsign
                    </label>
                    <input
                      type="text"
                      value={callsignInput}
                      onChange={e => setCallsignInput(e.target.value)}
                      className="px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400">
                      Tactical Bio
                    </label>
                    <input
                      type="text"
                      value={bioInput}
                      onChange={e => setBioInput(e.target.value)}
                      className="w-full sm:w-96 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-mono font-bold uppercase rounded bg-emerald-500 text-slate-950 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 text-xs font-mono text-slate-400 hover:bg-slate-800 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Quick combat numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Combat Hours</div>
              <div className="text-lg font-black text-cyan-400">{(user.totalMinutes / 60).toFixed(1)}h</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Current Streak</div>
              <div className="text-lg font-black text-amber-400">🔥 {user.streak}d</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 uppercase">Objectives Cleared</div>
              <div className="text-lg font-black text-emerald-400">{user.completedTasksCount}</div>
            </div>
          </div>
        </div>

        {/* Current XP Progression Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">
              Rank Tier Progress: <strong className={rankInfo.color}>{rankInfo.name}</strong>
            </span>
            <span className="text-emerald-400 font-bold">
              {rankProgress.nextRank ? `Next: ${rankProgress.nextRank.name} (${rankProgress.xpNeeded} XP needed)` : 'Maximum Rank Attained'}
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_#10b981]"
              style={{ width: `${rankProgress.progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>{rankInfo.minXp} XP ({rankInfo.name})</span>
            <span className="text-slate-300 font-bold">{user.xp} Total XP</span>
            <span>{rankProgress.nextRank ? `${rankProgress.nextRank.minXp} XP` : '18,000+ XP'}</span>
          </div>
        </div>
      </div>

      {/* Military Rank Ladder */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-100">
              Military Rank Advancement Ladder
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Earn 5 XP per study minute + 150 XP per DEFCON 1 task
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {RANKS.map(r => {
            const isUnlocked = user.xp >= r.minXp;
            const isCurrent = r.name === rankInfo.name;

            return (
              <div
                key={r.name}
                className={`p-3 rounded-xl border text-center transition font-mono ${
                  isCurrent
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : isUnlocked
                    ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                    : 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                <div className={`text-base font-black ${isUnlocked ? r.color : 'text-slate-600'}`}>
                  {r.abbr}
                </div>
                <div className="text-xs font-bold text-slate-200 mt-0.5">{r.name}</div>
                <div className="text-[10px] text-slate-500 mt-1">{r.minXp} XP</div>
                {isCurrent && (
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[9px] font-black uppercase">
                    CURRENT
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Combat Merit Badges & Medals Showcase */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-100">
              Combat Merit Badges & Medals
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {user.badges.length} / {BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {BADGES.map(badge => {
            const isEarned = user.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                  isEarned
                    ? 'bg-slate-950 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                }`}
              >
                <div className="text-2xl p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {badge.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-xs text-slate-200">
                      {badge.name}
                    </h3>
                    {isEarned ? (
                      <span className="text-[9px] font-mono px-1 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        AWARDED
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-500 border border-slate-800">
                        LOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-snug">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
