export type Rank = 
  | 'Cadet'
  | 'Private'
  | 'Specialist'
  | 'Corporal'
  | 'Sergeant'
  | 'Staff Sergeant'
  | 'Lieutenant'
  | 'Captain'
  | 'Major'
  | 'Commander';

export type UserStatus = 'online' | 'in-session' | 'standby' | 'resting';

export type DefconLevel = 'DEFCON_1' | 'DEFCON_2' | 'DEFCON_3' | 'DEFCON_4';

export interface UserProfile {
  uid: string;
  email: string;
  callsign: string;
  realName?: string;
  avatar: string;
  rank: Rank;
  xp: number;
  streak: number; // days
  totalMinutes: number;
  activeSquadId: string | null;
  status: UserStatus;
  currentObjective?: string;
  sessionStartedAt?: number | null;
  completedTasksCount: number;
  bio?: string;
  badges: string[];
}

export interface SquadMember {
  uid: string;
  callsign: string;
  avatar: string;
  rank: Rank;
  role: 'Commander' | 'XO' | 'Operative' | 'Recruit';
  status: UserStatus;
  currentObjective?: string;
  minutesStudiedToday: number;
  joinedAt: number;
}

export interface Squad {
  id: string;
  name: string;
  callsignTag: string; // e.g. [A-STRIKE], [BIO-MED]
  motto: string;
  category: 'STEM' | 'Pre-Med' | 'Computer Science' | 'Law / Humanities' | 'Exam Prep' | 'General';
  description: string;
  avatar: string;
  creatorId: string;
  creatorCallsign: string;
  members: SquadMember[];
  memberCount: number;
  totalHoursStudied: number;
  weeklyGoalHours: number;
  currentWeeklyHours: number;
  joinCode: string;
  isPublic: boolean;
  createdAt: number;
  pinnedNotice?: string;
}

export type SitrepType = 
  | 'session_start'
  | 'session_complete'
  | 'task_neutralized'
  | 'rank_promoted'
  | 'streak_milestone'
  | 'squad_created'
  | 'salute_broadcast'
  | 'awol_alert'
  | 'radio_check_passed'
  | 'bunker_sync';

export interface BunkerOperative {
  uid: string;
  callsign: string;
  avatar: string;
  rank: Rank;
  role: string;
  objective: string;
  focusShield: 'active' | 'radio_check' | 'breached';
  elapsedSeconds: number;
  targetSeconds: number;
  breachCount: number;
  lastCheckIn: number;
  reactions: { id: string; from: string; emoji: string }[];
}

export interface RadioCheck {
  id: string;
  initiatedAt: number;
  expiresAt: number;
  timeRemainingSeconds: number;
  active: boolean;
}

export interface SitrepReaction {
  uid: string;
  callsign: string;
  reaction: '🫡' | '🔥' | '⚡' | '🎯' | '🛡️';
}

export interface Sitrep {
  id: string;
  userId: string;
  userCallsign: string;
  userRank: Rank;
  userAvatar: string;
  squadId?: string;
  squadName?: string;
  type: SitrepType;
  title: string;
  detail: string;
  timestamp: number;
  durationMinutes?: number;
  reactions: SitrepReaction[];
}

export interface ArmoryTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: DefconLevel;
  subject: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: number;
  createdAt: number;
  dueDate?: string;
  xpReward: number;
  links?: { title: string; url: string }[];
}

export interface StudySession {
  id: string;
  userId: string;
  squadId?: string;
  objective: string;
  mode: 'pomodoro' | 'deep_work' | 'stopwatch';
  targetMinutes: number;
  elapsedSeconds: number;
  isPaused: boolean;
  isCompleted: boolean;
  startedAt: number;
  completedAt?: number;
  notes?: string;
  xpEarned: number;
}

export interface TacticalMessage {
  id: string;
  squadId: string;
  senderId: string;
  senderCallsign: string;
  senderRank: Rank;
  senderAvatar: string;
  text: string;
  timestamp: number;
  isUrgent?: boolean;
}
