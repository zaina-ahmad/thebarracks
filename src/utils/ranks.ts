import { Rank } from '../types';

export interface RankInfo {
  name: Rank;
  minXp: number;
  abbr: string;
  insignia: string;
  color: string;
  bgBadge: string;
  borderColor: string;
}

export const RANKS: RankInfo[] = [
  { name: 'Cadet', minXp: 0, abbr: 'CDT', insignia: '◇', color: 'text-slate-400', bgBadge: 'bg-slate-800/80', borderColor: 'border-slate-600' },
  { name: 'Private', minXp: 200, abbr: 'PVT', insignia: '▲', color: 'text-emerald-400', bgBadge: 'bg-emerald-950/80', borderColor: 'border-emerald-600' },
  { name: 'Specialist', minXp: 600, abbr: 'SPC', insignia: '▲▲', color: 'text-teal-400', bgBadge: 'bg-teal-950/80', borderColor: 'border-teal-600' },
  { name: 'Corporal', minXp: 1200, abbr: 'CPL', insignia: '▲▲▲', color: 'text-cyan-400', bgBadge: 'bg-cyan-950/80', borderColor: 'border-cyan-600' },
  { name: 'Sergeant', minXp: 2200, abbr: 'SGT', insignia: '3 STRIPES', color: 'text-sky-400', bgBadge: 'bg-sky-950/80', borderColor: 'border-sky-600' },
  { name: 'Staff Sergeant', minXp: 3500, abbr: 'SSG', insignia: '3 STRIPES + ROCKER', color: 'text-indigo-400', bgBadge: 'bg-indigo-950/80', borderColor: 'border-indigo-600' },
  { name: 'Lieutenant', minXp: 5500, abbr: 'LT', insignia: '★', color: 'text-amber-400', bgBadge: 'bg-amber-950/80', borderColor: 'border-amber-600' },
  { name: 'Captain', minXp: 8000, abbr: 'CPT', insignia: '★★', color: 'text-orange-400', bgBadge: 'bg-orange-950/80', borderColor: 'border-orange-600' },
  { name: 'Major', minXp: 12000, abbr: 'MAJ', insignia: '★★★', color: 'text-rose-400', bgBadge: 'bg-rose-950/80', borderColor: 'border-rose-600' },
  { name: 'Commander', minXp: 18000, abbr: 'CDR', insignia: '✪✪✪', color: 'text-yellow-300', bgBadge: 'bg-yellow-950/80', borderColor: 'border-yellow-500' },
];

export function getRankFromXp(xp: number): RankInfo {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXp) {
      currentRank = rank;
    } else {
      break;
    }
  }
  return currentRank;
}

export function getNextRankProgress(xp: number) {
  const currentRank = getRankFromXp(xp);
  const currentIndex = RANKS.findIndex(r => r.name === currentRank.name);
  if (currentIndex === RANKS.length - 1) {
    return {
      currentRank,
      nextRank: null,
      progressPercent: 100,
      xpNeeded: 0,
      currentTierXp: xp - currentRank.minXp,
      tierSpan: 1000,
    };
  }
  const nextRank = RANKS[currentIndex + 1];
  const tierSpan = nextRank.minXp - currentRank.minXp;
  const currentTierXp = xp - currentRank.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentTierXp / tierSpan) * 100)));
  const xpNeeded = nextRank.minXp - xp;

  return {
    currentRank,
    nextRank,
    progressPercent,
    xpNeeded,
    currentTierXp,
    tierSpan,
  };
}

export const BADGES = [
  { id: 'first_deployment', name: 'First Blood', desc: 'Completed your first combat study session', icon: '⚔️' },
  { id: 'deep_diver', name: 'Deep Recon', desc: 'Finished a 90+ minute uninterrupted focus session', icon: '🌊' },
  { id: 'iron_streak_7', name: '7-Day Iron Will', desc: 'Logged active study 7 days in a row', icon: '🛡️' },
  { id: 'armory_master', name: 'Armory Cleared', desc: 'Neutralized 25 objectives in the Armory', icon: '🎯' },
  { id: 'squad_leader', name: 'Vanguard Leader', desc: 'Formed or led a platoon squad', icon: '👑' },
  { id: 'night_hawk', name: 'Night Ops', desc: 'Completed a study mission between 0000Z and 0400Z', icon: '🦉' },
  { id: 'centurion', name: 'Centurion', desc: 'Logged over 100 combat study hours', icon: '🎖️' },
];
