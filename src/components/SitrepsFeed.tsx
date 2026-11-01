import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Radio, 
  Filter, 
  Send, 
  Flame, 
  Award, 
  CheckCircle2, 
  Target, 
  Clock, 
  Shield, 
  MessageSquare,
  Users
} from 'lucide-react';
import { SitrepType } from '../types';

export const SitrepsFeed: React.FC = () => {
  const { user, sitreps, addSitrep, reactToSitrep, activeSquad } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<SitrepType>('salute_broadcast');

  const filteredSitreps = sitreps.filter(s => {
    if (filterType === 'all') return true;
    if (filterType === 'squad') return s.squadId === user.activeSquadId;
    if (filterType === 'sessions') return s.type === 'session_start' || s.type === 'session_complete';
    if (filterType === 'tasks') return s.type === 'task_neutralized';
    if (filterType === 'promotions') return s.type === 'rank_promoted';
    return true;
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    addSitrep(
      broadcastCategory,
      broadcastCategory === 'salute_broadcast' ? 'TACTICAL INTEL TRANSMISSION' : 'FIELD DISPATCH',
      broadcastText.trim()
    );
    setBroadcastText('');
  };

  const getSitrepIcon = (type: SitrepType) => {
    switch (type) {
      case 'session_start':
        return <Target className="w-4 h-4 text-emerald-400" />;
      case 'session_complete':
        return <Clock className="w-4 h-4 text-cyan-400" />;
      case 'task_neutralized':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'rank_promoted':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'squad_created':
        return <Shield className="w-4 h-4 text-indigo-400" />;
      default:
        return <Radio className="w-4 h-4 text-emerald-400" />;
    }
  };

  const reactionEmojis = [
    { emoji: '🫡', label: 'Salute' },
    { emoji: '🔥', label: 'Reinforce' },
    { emoji: '⚡', label: 'Overclock' },
    { emoji: '🎯', label: 'On Target' },
    { emoji: '🛡️', label: 'Defend' },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header & Fast Broadcast Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h1 className="text-lg font-mono font-bold uppercase tracking-wider text-slate-100">
              SITREP // Situation Reports Feed
            </h1>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            REAL-TIME INTEL RADAR
          </span>
        </div>

        {/* Manual Broadcast Form */}
        <form onSubmit={handleBroadcast} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Transmit tactical broadcast (e.g. 'Completed 50 LeetCode problems this week' or 'Starting Biochem study group')..."
              value={broadcastText}
              onChange={e => setBroadcastText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs font-mono bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition shrink-0"
            >
              <Send className="w-3.5 h-3.5" /> Transmit
            </button>
          </div>
        </form>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Intel', count: sitreps.length },
            { id: 'squad', label: 'My Platoon', count: sitreps.filter(s => s.squadId === user.activeSquadId).length },
            { id: 'sessions', label: 'Combat Ops', count: sitreps.filter(s => s.type.includes('session')).length },
            { id: 'tasks', label: 'Objectives Neutralized', count: sitreps.filter(s => s.type === 'task_neutralized').length },
            { id: 'promotions', label: 'Promotions', count: sitreps.filter(s => s.type === 'rank_promoted').length },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition border ${
                filterType === f.id
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Sitreps Feed List */}
      <div className="space-y-4">
        {filteredSitreps.length > 0 ? (
          filteredSitreps.map(rep => {
            const timeAgo = Math.max(1, Math.round((Date.now() - rep.timestamp) / 60000));
            const isUser = rep.userId === user.uid;

            return (
              <div
                key={rep.id}
                className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition space-y-3"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rep.userAvatar}
                      alt={rep.userCallsign}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-100">
                          {rep.userCallsign}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {rep.userRank}
                        </span>
                        {isUser && (
                          <span className="text-[10px] font-mono px-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {rep.squadName ? `${rep.squadName} • ` : ''}
                        {timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`}
                      </div>
                    </div>
                  </div>

                  {/* SITREP Type Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 shrink-0">
                    {getSitrepIcon(rep.type)}
                    <span className="text-[11px] font-bold uppercase">
                      {rep.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Sitrep Title & Content */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {rep.title}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {rep.detail}
                  </p>
                </div>

                {/* Reaction Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {reactionEmojis.map(({ emoji, label }) => {
                      const count = rep.reactions.filter(r => r.reaction === emoji).length;
                      const hasReacted = rep.reactions.some(r => r.uid === user.uid && r.reaction === emoji);

                      return (
                        <button
                          key={emoji}
                          onClick={() => reactToSitrep(rep.id, emoji)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                            hasReacted
                              ? 'bg-emerald-950 border-emerald-500/80 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                              : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                          title={label}
                        >
                          <span>{emoji}</span>
                          {count > 0 && <span className="text-[11px]">{count}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* List of reaction users summary */}
                  {rep.reactions.length > 0 && (
                    <div className="text-[10px] font-mono text-slate-500">
                      Saluted by {rep.reactions.slice(0, 2).map(r => r.callsign).join(', ')}
                      {rep.reactions.length > 2 && ` +${rep.reactions.length - 2} more`}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
            No sitreps found for this filter. Start an operation or broadcast an update to ping the network!
          </div>
        )}
      </div>
    </div>
  );
};
