import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Play, 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle, 
  ExternalLink, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { DefconLevel, ArmoryTask } from '../types';

export const ArmoryChecklist: React.FC = () => {
  const { 
    armoryTasks, 
    addArmoryTask, 
    toggleArmoryTask, 
    deleteArmoryTask, 
    startSession, 
    setActiveTab, 
    activeSquad 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDefcon, setSelectedDefcon] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<DefconLevel>('DEFCON_1');
  const [newSubject, setNewSubject] = useState('STEM');
  const [newMinutes, setNewMinutes] = useState(45);
  const [newDueDate, setNewDueDate] = useState('');

  // Extract unique subjects
  const subjects = Array.from(new Set(armoryTasks.map(t => t.subject).filter(Boolean)));

  const filteredTasks = armoryTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          task.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDefcon = selectedDefcon === 'ALL' || task.priority === selectedDefcon;
    const matchesSubject = selectedSubject === 'ALL' || task.subject === selectedSubject;
    return matchesSearch && matchesDefcon && matchesSubject;
  });

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addArmoryTask({
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      priority: newPriority,
      subject: newSubject.trim() || 'General',
      estimatedMinutes: newMinutes,
      dueDate: newDueDate || undefined,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewMinutes(45);
  };

  const defconBadges: Record<DefconLevel, { label: string; bg: string; text: string; border: string }> = {
    DEFCON_1: { label: 'DEFCON 1 // CRITICAL', bg: 'bg-rose-950/80', text: 'text-rose-400', border: 'border-rose-700/80' },
    DEFCON_2: { label: 'DEFCON 2 // HIGH', bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-700/80' },
    DEFCON_3: { label: 'DEFCON 3 // STANDARD', bg: 'bg-cyan-950/80', text: 'text-cyan-400', border: 'border-cyan-700/80' },
    DEFCON_4: { label: 'DEFCON 4 // ROUTINE', bg: 'bg-slate-800/80', text: 'text-slate-300', border: 'border-slate-600/80' },
  };

  const completedCount = armoryTasks.filter(t => t.completed).length;
  const pendingCount = armoryTasks.length - completedCount;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-slate-100">
              The Armory // Personal Study Checklists
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Prioritize your academic battles by DEFCON threat level. Neutralize objectives for instant combat XP and automatic SITREP broadcasts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
        >
          <Plus className="w-4 h-4" /> Issue New Objective
        </button>
      </div>

      {/* Armory Progress HUD Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Neutralized Objectives</div>
            <div className="text-xl font-mono font-black text-emerald-400">{completedCount} Completed</div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Active Perimeter Threats</div>
            <div className="text-xl font-mono font-black text-amber-400">{pendingCount} Pending</div>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-400" />
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Total Armory XP Bounty</div>
            <div className="text-xl font-mono font-black text-cyan-400">
              +{armoryTasks.reduce((acc, t) => acc + (t.completed ? t.xpReward : 0), 0)} XP
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search missions by title, subject, keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* DEFCON filter */}
          <select
            value={selectedDefcon}
            onChange={e => setSelectedDefcon(e.target.value)}
            className="px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Threat Levels</option>
            <option value="DEFCON_1">DEFCON 1 (Critical)</option>
            <option value="DEFCON_2">DEFCON 2 (High)</option>
            <option value="DEFCON_3">DEFCON 3 (Standard)</option>
            <option value="DEFCON_4">DEFCON 4 (Routine)</option>
          </select>

          {/* Subject filter */}
          {subjects.length > 0 && (
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Checklists Task Grid */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const badge = defconBadges[task.priority];

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 group ${
                  task.completed
                    ? 'bg-slate-950/60 border-slate-800/60 opacity-70'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleArmoryTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition shrink-0 ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-slate-600 hover:border-emerald-400 bg-slate-950'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4 fill-current stroke-slate-950" />}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/60">
                        {task.subject}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px] font-mono text-slate-400">
                          Due: {task.dueDate}
                        </span>
                      )}
                    </div>

                    <h3 className={`text-sm font-mono font-bold text-slate-100 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-xs text-slate-400 font-sans line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Resources links if any */}
                    {task.links && task.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {task.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline"
                          >
                            <span>{link.title}</span> <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Actions: Time, XP, Deploy & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right font-mono hidden sm:block">
                    <div className="text-xs text-emerald-400 font-bold">
                      +{task.xpReward} XP
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {task.estimatedMinutes}m est.
                    </div>
                  </div>

                  {!task.completed && (
                    <button
                      onClick={() => {
                        startSession(task.title, 'deep_work', task.estimatedMinutes, activeSquad?.id);
                        setActiveTab('ops');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 transition flex items-center gap-1"
                      title="Load directly into Combat Timer"
                    >
                      <Play className="w-3 h-3 fill-current" /> Deploy
                    </button>
                  )}

                  <button
                    onClick={() => deleteArmoryTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition"
                    title="Remove Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 font-mono text-xs">
            No missions found matching your search parameters. Issue a new objective to fill your Armory arsenal!
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-100">
                  Issue Tactical Objective to Armory
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Objective Title <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Derive Maxwell's Equations Problem Set 5"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    DEFCON Threat Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as DefconLevel)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DEFCON_1">DEFCON 1 (Critical / +150 XP)</option>
                    <option value="DEFCON_2">DEFCON 2 (High / +100 XP)</option>
                    <option value="DEFCON_3">DEFCON 3 (Standard / +75 XP)</option>
                    <option value="DEFCON_4">DEFCON 4 (Routine / +50 XP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Subject / Course
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Chem"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Estimated Focus Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={240}
                    value={newMinutes}
                    onChange={e => setNewMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Tactical Notes / Detailed Mission Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Specific requirements, page numbers, or key equations to solve..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                >
                  Add to Arsenal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
