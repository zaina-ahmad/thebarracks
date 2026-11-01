import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Users, 
  Clock, 
  Radio, 
  Plus, 
  Send, 
  Trophy, 
  AlertTriangle, 
  ChevronRight, 
  Check, 
  Lock, 
  Compass,
  MessageSquare
} from 'lucide-react';
import { Squad } from '../types';

export const SquadsView: React.FC = () => {
  const { 
    user, 
    squads, 
    activeSquad, 
    createSquad, 
    joinSquad, 
    leaveSquad, 
    setActiveSquadId, 
    squadMessages, 
    sendSquadMessage 
  } = useApp();

  const [selectedSquadId, setSelectedSquadId] = useState<string>(activeSquad?.id || squads[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chatMessageText, setChatMessageText] = useState('');
  const [isUrgentMsg, setIsUrgentMsg] = useState(false);

  // New squad form state
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadTag, setNewSquadTag] = useState('');
  const [newSquadMotto, setNewSquadMotto] = useState('');
  const [newSquadCategory, setNewSquadCategory] = useState<Squad['category']>('STEM');
  const [newSquadDesc, setNewSquadDesc] = useState('');
  const [newSquadGoal, setNewSquadGoal] = useState(50);

  const currentSquad = squads.find(s => s.id === selectedSquadId) || activeSquad || squads[0];

  const categories = ['ALL', 'STEM', 'Pre-Med', 'Computer Science', 'Law / Humanities', 'Exam Prep'];

  const filteredSquads = squads.filter(s => {
    if (activeCategory === 'ALL') return true;
    return s.category === activeCategory;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;
    sendSquadMessage(chatMessageText, isUrgentMsg);
    setChatMessageText('');
    setIsUrgentMsg(false);
  };

  const handleCreateSquadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;

    createSquad({
      name: newSquadName.trim(),
      callsignTag: newSquadTag.trim() ? `[${newSquadTag.toUpperCase()}]` : `[${newSquadName.substring(0, 4).toUpperCase()}]`,
      motto: newSquadMotto.trim() || 'Excellence through Discipline',
      category: newSquadCategory,
      description: newSquadDesc.trim() || 'Tactical student study squad.',
      weeklyGoalHours: newSquadGoal,
      isPublic: true,
    });

    setShowCreateModal(false);
    setNewSquadName('');
    setNewSquadTag('');
    setNewSquadMotto('');
    setNewSquadDesc('');
  };

  const currentSquadMessages = squadMessages.filter(m => m.squadId === currentSquad?.id);

  // Sort squad members by minutes studied today for leaderboard
  const sortedMembers = [...(currentSquad?.members || [])].sort((a, b) => b.minutesStudiedToday - a.minutesStudiedToday);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner & Squad Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-slate-100">
              Platoons & Study Squads
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Join or establish tactical study platoons. Hold the line with live accountability, shared weekly study hour targets, and direct tactical comms.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
        >
          <Plus className="w-4 h-4" /> Commission New Platoon
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition border ${
              activeCategory === cat
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Squad Directory & Selected Squad Command Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Platoon Directory Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Battalions ({filteredSquads.length})
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredSquads.map(sq => {
              const isSelected = sq.id === currentSquad?.id;
              const isMySquad = sq.id === user.activeSquadId;

              return (
                <div
                  key={sq.id}
                  onClick={() => setSelectedSquadId(sq.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={sq.avatar}
                        alt={sq.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="font-mono font-bold text-xs text-slate-100 line-clamp-1">
                          {sq.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 rounded border border-cyan-800">
                            {sq.callsignTag}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {sq.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isMySquad && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                        MY SQUAD
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {sq.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {sq.members.length} Operatives
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Clock className="w-3.5 h-3.5" /> {sq.totalHoursStudied}h Logged
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Platoon Operations Hub (8 Cols) */}
        {currentSquad ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Squad Banner Header */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={currentSquad.avatar}
                    alt={currentSquad.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500/80 shadow-lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-mono font-black text-slate-100">
                        {currentSquad.name}
                      </h2>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        {currentSquad.callsignTag}
                      </span>
                    </div>
                    <p className="text-xs font-mono italic text-emerald-400 mt-1">
                      "{currentSquad.motto}"
                    </p>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      Commanded by {currentSquad.creatorCallsign} • Join Code: <code className="text-slate-300 font-bold">{currentSquad.joinCode}</code>
                    </div>
                  </div>
                </div>

                {/* Join / Active Status Button */}
                <div>
                  {user.activeSquadId === currentSquad.id ? (
                    <button
                      onClick={() => leaveSquad(currentSquad.id)}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/60 transition"
                    >
                      Leave Platoon
                    </button>
                  ) : (
                    <button
                      onClick={() => joinSquad(currentSquad.id)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                    >
                      Enlist in Squad
                    </button>
                  )}
                </div>
              </div>

              {/* Pinned Directive Notice */}
              {currentSquad.pinnedNotice && (
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-900/40 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      STANDING TACTICAL DIRECTIVE:
                    </span>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">
                      {currentSquad.pinnedNotice}
                    </p>
                  </div>
                </div>
              )}

              {/* Weekly Study Progress Meter */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase">Weekly Platoon Target:</span>
                  <span className="text-emerald-400 font-bold">
                    {currentSquad.currentWeeklyHours} / {currentSquad.weeklyGoalHours} Combat Hours
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((currentSquad.currentWeeklyHours / currentSquad.weeklyGoalHours) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sub-grid: Live Roster & Tactical Comms Radio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Member Live Roster & Leaderboard */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                      Roster & Study Hours
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {currentSquad.members.length} Members
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {sortedMembers.map((m, idx) => (
                    <div
                      key={m.uid}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`text-[11px] font-mono font-bold w-4 text-center ${
                          idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>

                        <div className="relative shrink-0">
                          <img
                            src={m.avatar}
                            alt={m.callsign}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${
                            m.status === 'in-session' ? 'bg-emerald-400 animate-ping' :
                            m.status === 'standby' ? 'bg-amber-400' : 'bg-slate-600'
                          }`} />
                        </div>

                        <div className="min-w-0">
                          <div className="font-mono font-bold text-slate-200 truncate">
                            {m.callsign} {m.uid === user.uid && '(YOU)'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {m.status === 'in-session' ? `Ops: ${m.currentObjective || 'Focus'}` : m.role}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono">
                        <div className="text-emerald-400 font-bold">
                          {m.minutesStudiedToday}m
                        </div>
                        <div className="text-[9px] text-slate-500">
                          today
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-Time Tactical Comms Radio Channel */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[420px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                      Tactical Radio // Comms
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    FREQ: 142.85 MHz
                  </span>
                </div>

                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs">
                  {currentSquadMessages.length > 0 ? (
                    currentSquadMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded-xl border ${
                          msg.isUrgent
                            ? 'bg-rose-950/60 border-rose-800/80 text-rose-200'
                            : msg.senderId === user.uid
                            ? 'bg-emerald-950/40 border-emerald-800/60 ml-4'
                            : 'bg-slate-950 border-slate-800/80 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span className="font-bold text-slate-200 flex items-center gap-1">
                            {msg.senderCallsign}
                            <span className="text-[9px] text-slate-500 font-normal">[{msg.senderRank}]</span>
                          </span>
                          <span>
                            {Math.max(1, Math.round((Date.now() - msg.timestamp) / 60000))}m ago
                          </span>
                        </div>
                        <p className="text-slate-300 font-sans leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-500 py-12 text-xs font-mono">
                      Radio silence. Transmit the first sitrep or dispatch to your squad.
                    </div>
                  )}
                </div>

                {/* Comms input */}
                <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Transmit to squad..."
                      value={chatMessageText}
                      onChange={e => setChatMessageText(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUrgentMsg}
                        onChange={e => setIsUrgentMsg(e.target.checked)}
                        className="rounded border-slate-700 text-rose-500 focus:ring-0"
                      />
                      <span className={isUrgentMsg ? 'text-rose-400 font-bold' : ''}>Urgent Directive</span>
                    </label>
                    <span>Press Enter to Transmit</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Commission New Platoon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-100">
                  Commission New Study Platoon
                </h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSquadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Platoon Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Flight // MCAT Bio-Warfare"
                  value={newSquadName}
                  onChange={e => setNewSquadName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Callsign Tag
                  </label>
                  <input
                    type="text"
                    placeholder="APEX-MCAT"
                    value={newSquadTag}
                    onChange={e => setNewSquadTag(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newSquadCategory}
                    onChange={e => setNewSquadCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="STEM">STEM</option>
                    <option value="Pre-Med">Pre-Med</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Law / Humanities">Law / Humanities</option>
                    <option value="Exam Prep">Exam Prep</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Motto / Battle Cry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Relentless Focus. Zero Hesitation."
                  value={newSquadMotto}
                  onChange={e => setNewSquadMotto(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Tactical Briefing / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What is this squad's core discipline, target exams, and study rules?"
                  value={newSquadDesc}
                  onChange={e => setNewSquadDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Weekly Goal: {newSquadGoal} Combat Hours
                </label>
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={newSquadGoal}
                  onChange={e => setNewSquadGoal(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                >
                  Commission Platoon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
