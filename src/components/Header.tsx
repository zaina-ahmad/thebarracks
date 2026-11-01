import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Crosshair, 
  Volume2, 
  VolumeX, 
  Radio, 
  Clock, 
  Shield, 
  Flame, 
  Award, 
  Headphones, 
  Play, 
  Pause,
  Cloud,
  ChevronDown
} from 'lucide-react';
import { RANKS, getRankFromXp, getNextRankProgress } from '../utils/ranks';

export const Header: React.FC = () => {
  const { 
    user, 
    activeSession, 
    activeTab, 
    setActiveTab, 
    isMuted, 
    toggleMute, 
    activeSoundscape, 
    setSoundscape, 
    isFirebaseActive, 
    setIsFirebaseModalOpen, 
    zuluTime,
    radioCheck
  } = useApp();

  const [soundMenuOpen, setSoundMenuOpen] = useState(false);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);

  const rankInfo = getRankFromXp(user.xp);
  const rankProgress = getNextRankProgress(user.xp);

  // Format active session elapsed seconds
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  interface NavItem {
    id: 'radar' | 'bunker' | 'ops' | 'sitrep' | 'squads' | 'armory' | 'dossier';
    label: string;
    icon: React.ElementType;
    badge?: string | null;
  }

  const navItems: NavItem[] = [
    { id: 'radar', label: 'Radar', icon: Crosshair },
    { id: 'bunker', label: 'The Bunker', icon: Shield, badge: radioCheck?.active ? 'RADIO PING' : 'SYNC' },
    { id: 'ops', label: 'Tactical Ops', icon: Clock, badge: activeSession ? 'LIVE' : null },
    { id: 'sitrep', label: 'Sitreps', icon: Radio },
    { id: 'squads', label: 'Platoons', icon: Shield },
    { id: 'armory', label: 'Armory', icon: Award },
    { id: 'dossier', label: 'Dossier', icon: Flame },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070a0d]/95 backdrop-blur border-b border-slate-800">
      {/* Top HUD Status Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 border-b border-slate-800/60">
          {/* Logo & Call Sign */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setActiveTab('radar')}
              className="cursor-pointer flex items-center gap-2 group"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 group-hover:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] transition">
                <Crosshair className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-base font-black tracking-wider text-slate-100">
                    BARRACKS
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                    v2.4-OPS
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
                  Tactical Study & Accountability
                </span>
              </div>
            </div>

            {/* Tactical Zulu Military Clock */}
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-slate-400 text-xs font-mono">
              <span className="text-slate-500 font-bold">ZULU:</span>
              <span className="text-emerald-400 font-bold tracking-widest">{zuluTime || '0000:00Z'}</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400/90 font-semibold text-[11px]">DEFCON 2 // ACTIVE FOCUS</span>
            </div>
          </div>

          {/* Right Header Status Elements */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Session Indicator Pill */}
            {activeSession ? (
              <button
                onClick={() => setActiveTab('ops')}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500 text-emerald-300 hover:bg-emerald-900/60 transition shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-bold tracking-wider">
                  OPS ACTIVE: {formatTimer(activeSession.elapsedSeconds)}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('ops')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800 transition"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>STANDBY</span>
              </button>
            )}

            {/* Ambient Soundscapes Selector */}
            <div className="relative">
              <button
                onClick={() => setSoundMenuOpen(!soundMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition ${
                  activeSoundscape 
                    ? 'bg-cyan-950/70 border-cyan-500/80 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Tactical Focus Soundscapes"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {activeSoundscape ? activeSoundscape.replace('_', ' ').toUpperCase() : 'AUDIO'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {soundMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 z-50 text-xs font-mono animate-fade-in"
                  onMouseLeave={() => setSoundMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Tactical Soundscapes
                  </div>
                  {[
                    { id: 'rain', label: 'Tactical Rainstorm', desc: 'Biquad filtered pink noise' },
                    { id: 'bunker_hum', label: 'Bunker Ambiance', desc: '55Hz command drone' },
                    { id: 'gamma_40hz', label: '40Hz Gamma Focus', desc: 'Hyperfocus wave' },
                    { id: 'radio_static', label: 'Military Squelch', desc: 'Radio frequency static' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSoundscape(s.id as any);
                        setSoundMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                        activeSoundscape === s.id ? 'bg-cyan-950/60 text-cyan-300 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div>{s.label}</div>
                        <div className="text-[10px] text-slate-500">{s.desc}</div>
                      </div>
                      {activeSoundscape === s.id && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                      )}
                    </button>
                  ))}

                  {activeSoundscape && (
                    <button
                      onClick={() => {
                        setSoundscape(null);
                        setSoundMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-950/40 border-t border-slate-800 transition"
                    >
                      Stop Soundscape
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded border transition ${
                isMuted 
                  ? 'bg-rose-950/60 border-rose-800/80 text-rose-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={isMuted ? 'Tactical Audio Muted' : 'Tactical Audio Active'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Firebase Uplink Button */}
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition ${
                isFirebaseActive 
                  ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                  : 'bg-cyan-950/50 border-cyan-800/80 text-cyan-300 hover:border-cyan-500'
              }`}
              title="Firebase Real-time Cloud Uplink Config"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{isFirebaseActive ? 'FIREBASE ON' : 'LOCAL MESH'}</span>
              <span className={`w-2 h-2 rounded-full ${isFirebaseActive ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
            </button>

            {/* Operative Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfilePopoverOpen(!profilePopoverOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 hover:border-slate-500 transition"
              >
                <img
                  src={user.avatar}
                  alt={user.callsign}
                  className="w-6 h-6 rounded-full object-cover border border-emerald-500/60"
                />
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-mono font-bold text-slate-200 leading-tight">
                    {user.callsign}
                  </span>
                  <span className={`text-[9px] font-mono font-semibold ${rankInfo.color} leading-none`}>
                    {rankInfo.abbr} // {user.xp} XP
                  </span>
                </div>
              </button>

              {/* Profile HUD Popover */}
              {profilePopoverOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-fade-in"
                  onMouseLeave={() => setProfilePopoverOpen(false)}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <img
                      src={user.avatar}
                      alt={user.callsign}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <div className="font-mono font-bold text-sm text-slate-100">{user.callsign}</div>
                      <div className={`text-xs font-mono font-semibold ${rankInfo.color}`}>
                        {rankInfo.name} ({rankInfo.abbr})
                      </div>
                      <div className="text-[10px] text-slate-400">{user.email}</div>
                    </div>
                  </div>

                  {/* Rank XP Progress */}
                  <div className="py-3 border-b border-slate-800">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400">Next Rank:</span>
                      <span className="text-emerald-400 font-bold">
                        {rankProgress.nextRank ? rankProgress.nextRank.name : 'MAX RANK'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${rankProgress.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>{user.xp} XP</span>
                      {rankProgress.nextRank && <span>{rankProgress.xpNeeded} XP needed</span>}
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 py-3 text-center">
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <div className="text-xs text-slate-400 font-mono">Streak</div>
                      <div className="text-sm font-mono font-bold text-amber-400">🔥 {user.streak} Days</div>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <div className="text-xs text-slate-400 font-mono">Study Time</div>
                      <div className="text-sm font-mono font-bold text-cyan-400">{Math.round(user.totalMinutes / 60)} hrs</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('dossier');
                      setProfilePopoverOpen(false);
                    }}
                    className="w-full mt-1 py-1.5 text-center text-xs font-mono font-bold uppercase rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    View Personnel Dossier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tactical Nav Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
