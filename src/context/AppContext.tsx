import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  Squad, 
  Sitrep, 
  ArmoryTask, 
  StudySession, 
  TacticalMessage, 
  SitrepType,
  Rank,
  BunkerOperative,
  RadioCheck
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_SQUADS, 
  INITIAL_SITREPS, 
  INITIAL_ARMORY_TASKS, 
  INITIAL_MESSAGES 
} from '../data/initialData';
import { tacticalAudio } from '../utils/audio';
import { getRankFromXp } from '../utils/ranks';
import { 
  getSavedFirebaseConfig, 
  saveFirebaseConfig, 
  initializeFirebase, 
  tacticalSyncChannel, 
  FirebaseConfig 
} from '../services/firebase';

interface AppContextType {
  // User Profile
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUserCallsign: (callsign: string, bio?: string) => void;
  setUserStatus: (status: UserProfile['status']) => void;

  // Active Session
  activeSession: StudySession | null;
  startSession: (objective: string, mode: 'pomodoro' | 'deep_work' | 'stopwatch', targetMinutes: number, squadId?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  finishSession: (notes?: string) => void;
  cancelSession: () => void;

  // Platoons & Squads
  squads: Squad[];
  activeSquad: Squad | null;
  setActiveSquadId: (id: string | null) => void;
  createSquad: (data: Partial<Squad>) => void;
  joinSquad: (squadId: string) => void;
  leaveSquad: (squadId: string) => void;
  squadMessages: TacticalMessage[];
  sendSquadMessage: (text: string, isUrgent?: boolean) => void;

  // Sitreps
  sitreps: Sitrep[];
  addSitrep: (type: SitrepType, title: string, detail: string, durationMinutes?: number) => void;
  reactToSitrep: (sitrepId: string, reaction: '🫡' | '🔥' | '⚡' | '🎯' | '🛡️') => void;

  // Armory
  armoryTasks: ArmoryTask[];
  addArmoryTask: (task: Omit<ArmoryTask, 'id' | 'userId' | 'createdAt' | 'completed' | 'xpReward'>) => void;
  toggleArmoryTask: (taskId: string) => void;
  deleteArmoryTask: (taskId: string) => void;

  // Tactical Audio & Ambience
  isMuted: boolean;
  toggleMute: () => void;
  activeSoundscape: string | null;
  setSoundscape: (type: 'rain' | 'bunker_hum' | 'gamma_40hz' | 'radio_static' | null) => void;

  // The Bunker (War Room Co-Working & Accountability)
  bunkerOperatives: BunkerOperative[];
  radioCheck: RadioCheck | null;
  triggerRadioCheck: () => void;
  confirmRadioCheck: () => void;
  perimeterBreaches: number;
  startBunkerSync: (objective: string, minutes: number) => void;
  sendBunkerReaction: (targetUid: string, emoji: string) => void;
  isBunkerLocked: boolean;
  toggleBunkerLock: () => void;

  // Firebase Uplink
  isFirebaseActive: boolean;
  firebaseConfig: FirebaseConfig | null;
  connectFirebase: (config: FirebaseConfig) => boolean;
  disconnectFirebase: () => void;

  // UI state
  activeTab: 'radar' | 'bunker' | 'ops' | 'squads' | 'sitrep' | 'armory' | 'dossier';
  setActiveTab: (tab: 'radar' | 'bunker' | 'ops' | 'squads' | 'sitrep' | 'armory' | 'dossier') => void;
  isFirebaseModalOpen: boolean;
  setIsFirebaseModalOpen: (open: boolean) => void;
  zuluTime: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'barracks_user_profile';
const STORAGE_KEY_SQUADS = 'barracks_squads';
const STORAGE_KEY_SITREPS = 'barracks_sitreps';
const STORAGE_KEY_ARMORY = 'barracks_armory_tasks';
const STORAGE_KEY_MESSAGES = 'barracks_squad_messages';

const INITIAL_BUNKER_OPERATIVES: BunkerOperative[] = [
  {
    uid: 'user_valkyrie_1',
    callsign: 'Valkyrie-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    rank: 'Sergeant',
    role: 'Squad Commander',
    objective: 'Organic Chemistry: Aldol Condensations',
    focusShield: 'active',
    elapsedSeconds: 1540,
    targetSeconds: 3000,
    breachCount: 0,
    lastCheckIn: Date.now() - 5 * 60000,
    reactions: [],
  },
  {
    uid: 'user_ghost_9',
    callsign: 'Ghost-9',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    rank: 'Lieutenant',
    role: 'XO // Sniper Focus',
    objective: 'Quantum Mechanics: Wavefunctions & Schrodinger Equation',
    focusShield: 'active',
    elapsedSeconds: 2840,
    targetSeconds: 5400,
    breachCount: 0,
    lastCheckIn: Date.now() - 14 * 60000,
    reactions: [{ id: 'r1', from: 'Apex-4', emoji: '⚡' }],
  },
  {
    uid: 'user_apex_4',
    callsign: 'Apex-4',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    rank: 'Specialist',
    role: 'Vanguard Operative',
    objective: 'Thermodynamics Problem Set 5',
    focusShield: 'active',
    elapsedSeconds: 1320,
    targetSeconds: 3000,
    breachCount: 1,
    lastCheckIn: Date.now() - 8 * 60000,
    reactions: [{ id: 'r2', from: 'Valkyrie-01', emoji: '🫡' }],
  },
  {
    uid: 'user_cipher_7',
    callsign: 'Cipher-7',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    rank: 'Corporal',
    role: 'Heavy Weapons // Math',
    objective: 'Vector Calculus: Divergence & Stokes Theorem',
    focusShield: 'active',
    elapsedSeconds: 980,
    targetSeconds: 3000,
    breachCount: 0,
    lastCheckIn: Date.now() - 18 * 60000,
    reactions: [],
  },
  {
    uid: 'user_nova_3',
    callsign: 'Nova-3',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    rank: 'Private',
    role: 'Recruit Scout',
    objective: 'Physical Chemistry Review',
    focusShield: 'active',
    elapsedSeconds: 600,
    targetSeconds: 1500,
    breachCount: 0,
    lastCheckIn: Date.now() - 3 * 60000,
    reactions: [],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial data
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [squads, setSquads] = useState<Squad[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SQUADS);
    return saved ? JSON.parse(saved) : INITIAL_SQUADS;
  });

  const [sitreps, setSitreps] = useState<Sitrep[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SITREPS);
    return saved ? JSON.parse(saved) : INITIAL_SITREPS;
  });

  const [armoryTasks, setArmoryTasks] = useState<ArmoryTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ARMORY);
    return saved ? JSON.parse(saved) : INITIAL_ARMORY_TASKS;
  });

  const [squadMessages, setSquadMessages] = useState<TacticalMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [activeTab, setActiveTab] = useState<'radar' | 'bunker' | 'ops' | 'squads' | 'sitrep' | 'armory' | 'dossier'>('radar');
  const [isMuted, setIsMuted] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState<string | null>(null);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig | null>(() => getSavedFirebaseConfig());
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(false);
  const [zuluTime, setZuluTime] = useState<string>('');

  // The Bunker State
  const [bunkerOperatives, setBunkerOperatives] = useState<BunkerOperative[]>(INITIAL_BUNKER_OPERATIVES);
  const [radioCheck, setRadioCheck] = useState<RadioCheck | null>(null);
  const [perimeterBreaches, setPerimeterBreaches] = useState<number>(0);
  const [isBunkerLocked, setIsBunkerLocked] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SQUADS, JSON.stringify(squads));
  }, [squads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SITREPS, JSON.stringify(sitreps));
  }, [sitreps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ARMORY, JSON.stringify(armoryTasks));
  }, [armoryTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(squadMessages));
  }, [squadMessages]);

  // Tactical Zulu Military Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setZuluTime(`${hours}${mins}:${secs}Z`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Firebase if config present
  useEffect(() => {
    if (firebaseConfig) {
      const { app, db } = initializeFirebase(firebaseConfig);
      if (app && db) {
        setIsFirebaseActive(true);
      }
    }
  }, [firebaseConfig]);

  // Real-time local cross-tab sync via BroadcastChannel
  useEffect(() => {
    if (!tacticalSyncChannel) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'SITREP_NEW') {
        setSitreps(prev => [payload, ...prev.filter(s => s.id !== payload.id)]);
        tacticalAudio.playSitrepPing();
      } else if (type === 'SITREP_REACTION') {
        setSitreps(prev => prev.map(s => s.id === payload.sitrepId ? { ...s, reactions: payload.reactions } : s));
      } else if (type === 'SQUAD_MSG') {
        setSquadMessages(prev => [...prev, payload]);
        tacticalAudio.playRadioSquelch();
      } else if (type === 'SQUAD_UPDATE') {
        setSquads(payload);
      }
    };

    tacticalSyncChannel.addEventListener('message', handleMessage);
    return () => {
      if (tacticalSyncChannel) {
        tacticalSyncChannel.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  // Session timer ticker
  useEffect(() => {
    if (activeSession && !activeSession.isPaused) {
      timerRef.current = window.setInterval(() => {
        setActiveSession(prev => {
          if (!prev || prev.isPaused) return prev;
          const newElapsed = prev.elapsedSeconds + 1;
          return {
            ...prev,
            elapsedSeconds: newElapsed,
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeSession?.isPaused, activeSession !== null]);

  // Synchronize and tick Bunker Operatives in real-time
  useEffect(() => {
    const ticker = setInterval(() => {
      setBunkerOperatives(prev => prev.map(op => {
        if (op.uid === user.uid) {
          return {
            ...op,
            callsign: user.callsign,
            avatar: user.avatar,
            rank: user.rank,
            objective: activeSession ? activeSession.objective : (user.currentObjective || 'Command Center Standby'),
            focusShield: activeSession ? (activeSession.isPaused ? 'breached' : 'active') : 'active',
            elapsedSeconds: activeSession ? activeSession.elapsedSeconds : op.elapsedSeconds,
            targetSeconds: activeSession ? activeSession.targetMinutes * 60 : op.targetSeconds,
          };
        }
        // Advance simulated squadmates slightly
        const nextElapsed = op.elapsedSeconds + 1;
        return {
          ...op,
          elapsedSeconds: nextElapsed >= op.targetSeconds ? 0 : nextElapsed,
        };
      }));
    }, 1000);

    return () => clearInterval(ticker);
  }, [activeSession, user]);

  // Perimeter Breach Detection via Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (activeSession && !activeSession.isPaused) {
          setPerimeterBreaches(prev => prev + 1);
          setBunkerOperatives(prev => prev.map(op => {
            if (op.uid === user.uid) {
              return { ...op, focusShield: 'breached', breachCount: op.breachCount + 1 };
            }
            return op;
          }));
        }
      } else {
        if (activeSession && !activeSession.isPaused) {
          tacticalAudio.playBreachAlarm();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeSession?.isPaused, activeSession !== null, user.uid]);

  // Radio check countdown and expiration
  useEffect(() => {
    if (!radioCheck || !radioCheck.active) return;

    const interval = setInterval(() => {
      setRadioCheck(prev => {
        if (!prev || !prev.active) return null;
        if (prev.timeRemainingSeconds <= 1) {
          // Radio check expired!
          tacticalAudio.playBreachAlarm();
          addSitrep(
            'awol_alert',
            '⚠️ AWOL ALERT // RADIO CHECK MISSED',
            `Operative ${user.callsign} missed scheduled 45-second bunker accountability ping. Focus perimeter compromised!`
          );
          setBunkerOperatives(ops => ops.map(op => {
            if (op.uid === user.uid) {
              return { ...op, focusShield: 'breached' };
            }
            return op;
          }));
          return null;
        }
        return {
          ...prev,
          timeRemainingSeconds: prev.timeRemainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [radioCheck?.active, user.callsign, user.uid]);

  // Sound and ambient toggles
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    tacticalAudio.setMute(next);
  };

  const setSoundscape = (type: 'rain' | 'bunker_hum' | 'gamma_40hz' | 'radio_static' | null) => {
    if (!type || type === activeSoundscape) {
      tacticalAudio.stopAmbientSoundscape();
      setActiveSoundscape(null);
    } else {
      tacticalAudio.startAmbientSoundscape(type);
      setActiveSoundscape(type);
    }
  };

  // Firebase Uplink config handlers
  const connectFirebase = (config: FirebaseConfig) => {
    try {
      const result = initializeFirebase(config);
      if (result.app) {
        saveFirebaseConfig(config);
        setFirebaseConfig(config);
        setIsFirebaseActive(true);
        tacticalAudio.playRadioSquelch();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const disconnectFirebase = () => {
    saveFirebaseConfig(null);
    setFirebaseConfig(null);
    setIsFirebaseActive(false);
  };

  // User Actions
  const updateUserCallsign = (callsign: string, bio?: string) => {
    setUser(prev => ({
      ...prev,
      callsign,
      bio: bio !== undefined ? bio : prev.bio,
    }));
    tacticalAudio.playClick();
  };

  const setUserStatus = (status: UserProfile['status']) => {
    setUser(prev => ({ ...prev, status }));
  };

  // Sitrep operations
  const addSitrep = (type: SitrepType, title: string, detail: string, durationMinutes?: number) => {
    const newSitrep: Sitrep = {
      id: `sitrep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.uid,
      userCallsign: user.callsign,
      userRank: user.rank,
      userAvatar: user.avatar,
      squadId: user.activeSquadId || undefined,
      squadName: squads.find(s => s.id === user.activeSquadId)?.name,
      type,
      title,
      detail,
      timestamp: Date.now(),
      durationMinutes,
      reactions: [],
    };

    setSitreps(prev => [newSitrep, ...prev]);
    tacticalAudio.playSitrepPing();

    if (tacticalSyncChannel) {
      tacticalSyncChannel.postMessage({ type: 'SITREP_NEW', payload: newSitrep });
    }
  };

  const reactToSitrep = (sitrepId: string, reaction: '🫡' | '🔥' | '⚡' | '🎯' | '🛡️') => {
    setSitreps(prev => {
      const updated = prev.map(s => {
        if (s.id !== sitrepId) return s;
        // Check if user already reacted
        const existingIndex = s.reactions.findIndex(r => r.uid === user.uid);
        let nextReactions = [...s.reactions];
        if (existingIndex >= 0) {
          if (nextReactions[existingIndex].reaction === reaction) {
            nextReactions.splice(existingIndex, 1);
          } else {
            nextReactions[existingIndex] = { uid: user.uid, callsign: user.callsign, reaction };
          }
        } else {
          nextReactions.push({ uid: user.uid, callsign: user.callsign, reaction });
        }

        if (tacticalSyncChannel) {
          tacticalSyncChannel.postMessage({ 
            type: 'SITREP_REACTION', 
            payload: { sitrepId, reactions: nextReactions } 
          });
        }
        return { ...s, reactions: nextReactions };
      });
      return updated;
    });

    tacticalAudio.playClick();
  };

  // Armory Task Operations
  const addArmoryTask = (taskData: Omit<ArmoryTask, 'id' | 'userId' | 'createdAt' | 'completed' | 'xpReward'>) => {
    const xpMap: Record<string, number> = {
      DEFCON_1: 150,
      DEFCON_2: 100,
      DEFCON_3: 75,
      DEFCON_4: 50,
    };

    const newTask: ArmoryTask = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.uid,
      createdAt: Date.now(),
      completed: false,
      xpReward: xpMap[taskData.priority] || 75,
    };

    setArmoryTasks(prev => [newTask, ...prev]);
    tacticalAudio.playClick();
  };

  const toggleArmoryTask = (taskId: string) => {
    let completedNow = false;
    let earnedXp = 0;
    let taskTitle = '';

    setArmoryTasks(prev => {
      return prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          completedNow = nextState;
          earnedXp = t.xpReward;
          taskTitle = t.title;
          return {
            ...t,
            completed: nextState,
            completedAt: nextState ? Date.now() : undefined,
          };
        }
        return t;
      });
    });

    if (completedNow) {
      tacticalAudio.playObjectiveCleared();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#06b6d4', '#eab308'],
      });

      // Grant XP and check rank promotion
      setUser(prev => {
        const nextXp = prev.xp + earnedXp;
        const newRankInfo = getRankFromXp(nextXp);
        const rankUp = newRankInfo.name !== prev.rank;

        if (rankUp) {
          addSitrep('rank_promoted', `PROMOTION TO ${newRankInfo.name.toUpperCase()}`, `Earned ${nextXp} XP after neutralizing combat objective "${taskTitle}".`);
        }

        return {
          ...prev,
          xp: nextXp,
          rank: newRankInfo.name,
          completedTasksCount: prev.completedTasksCount + 1,
        };
      });

      addSitrep('task_neutralized', 'OBJECTIVE NEUTRALIZED', `Cleared tactical checklist item: "${taskTitle}" (+${earnedXp} XP)`);
    } else {
      tacticalAudio.playClick();
    }
  };

  const deleteArmoryTask = (taskId: string) => {
    setArmoryTasks(prev => prev.filter(t => t.id !== taskId));
    tacticalAudio.playClick();
  };

  // Session Operations
  const startSession = (objective: string, mode: 'pomodoro' | 'deep_work' | 'stopwatch', targetMinutes: number, squadId?: string) => {
    const session: StudySession = {
      id: `session_${Date.now()}`,
      userId: user.uid,
      squadId: squadId || user.activeSquadId || undefined,
      objective: objective.trim() || 'General Deep Study Block',
      mode,
      targetMinutes,
      elapsedSeconds: 0,
      isPaused: false,
      isCompleted: false,
      startedAt: Date.now(),
      xpEarned: 0,
    };

    setActiveSession(session);
    setUser(prev => ({
      ...prev,
      status: 'in-session',
      currentObjective: session.objective,
      sessionStartedAt: Date.now(),
    }));

    tacticalAudio.playRadioSquelch();
    tacticalAudio.playMissionStart();

    addSitrep(
      'session_start',
      'DEPLOYED TO COMBAT',
      `Locked into ${targetMinutes}-min ${mode === 'pomodoro' ? 'Pomodoro Ops' : mode === 'deep_work' ? 'Deep Recon Block' : 'Open Warfare'}: "${session.objective}"`,
      targetMinutes
    );
  };

  const pauseSession = () => {
    if (!activeSession) return;
    setActiveSession(prev => prev ? { ...prev, isPaused: true } : null);
    tacticalAudio.playClick();
  };

  const resumeSession = () => {
    if (!activeSession) return;
    setActiveSession(prev => prev ? { ...prev, isPaused: false } : null);
    tacticalAudio.playClick();
  };

  const finishSession = (notes?: string) => {
    if (!activeSession) return;

    const minutesStudied = Math.max(1, Math.round(activeSession.elapsedSeconds / 60));
    // XP calculation: 5 XP per minute + 25 bonus
    const xpGained = minutesStudied * 5 + 25;

    tacticalAudio.playObjectiveCleared();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
    });

    // Update user stats
    setUser(prev => {
      const nextXp = prev.xp + xpGained;
      const nextRank = getRankFromXp(nextXp).name;
      const rankUp = nextRank !== prev.rank;

      if (rankUp) {
        addSitrep('rank_promoted', `PROMOTION TO ${nextRank.toUpperCase()}`, `Operative crossed into ${nextRank} rank with ${nextXp} XP.`);
      }

      return {
        ...prev,
        xp: nextXp,
        rank: nextRank,
        totalMinutes: prev.totalMinutes + minutesStudied,
        status: 'online',
        sessionStartedAt: null,
      };
    });

    // Update squad study hours if in a squad
    const activeSquadId = activeSession.squadId || user.activeSquadId;
    if (activeSquadId) {
      setSquads(prev => prev.map(s => {
        if (s.id !== activeSquadId) return s;
        const newTotalHours = Number((s.totalHoursStudied + minutesStudied / 60).toFixed(1));
        const newWeeklyHours = Number((s.currentWeeklyHours + minutesStudied / 60).toFixed(1));
        
        // update member stats
        const updatedMembers = s.members.map(m => {
          if (m.uid === user.uid) {
            return {
              ...m,
              minutesStudiedToday: m.minutesStudiedToday + minutesStudied,
              status: 'online' as const,
            };
          }
          return m;
        });

        return {
          ...s,
          totalHoursStudied: newTotalHours,
          currentWeeklyHours: newWeeklyHours,
          members: updatedMembers,
        };
      }));
    }

    addSitrep(
      'session_complete',
      `MISSION SUCCESS // ${minutesStudied} MIN OPS`,
      `Completed combat study block: "${activeSession.objective}". Logged +${xpGained} XP. ${notes ? `Intel: ${notes}` : ''}`,
      minutesStudied
    );

    setActiveSession(null);
  };

  const cancelSession = () => {
    setActiveSession(null);
    setUser(prev => ({
      ...prev,
      status: 'online',
      sessionStartedAt: null,
    }));
    tacticalAudio.playClick();
  };

  // Squad operations
  const activeSquad = squads.find(s => s.id === user.activeSquadId) || squads[0] || null;

  const setActiveSquadId = (id: string | null) => {
    setUser(prev => ({ ...prev, activeSquadId: id }));
    tacticalAudio.playClick();
  };

  const createSquad = (data: Partial<Squad>) => {
    const newSquad: Squad = {
      id: `squad_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name || 'New Strike Squad',
      callsignTag: data.callsignTag || `[${data.name?.substring(0, 4).toUpperCase() || 'SQD'}]`,
      motto: data.motto || 'Strength Through Focus',
      category: data.category || 'STEM',
      description: data.description || 'Dedicated study platoon.',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=256&q=80',
      creatorId: user.uid,
      creatorCallsign: user.callsign,
      memberCount: 1,
      totalHoursStudied: 0,
      weeklyGoalHours: data.weeklyGoalHours || 50,
      currentWeeklyHours: 0,
      joinCode: `SQD-${Math.floor(100 + Math.random() * 900)}`,
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
      createdAt: Date.now(),
      pinnedNotice: 'Platoon operational. Check in on the comms channel.',
      members: [
        {
          uid: user.uid,
          callsign: user.callsign,
          avatar: user.avatar,
          rank: user.rank,
          role: 'Commander',
          status: user.status,
          currentObjective: user.currentObjective,
          minutesStudiedToday: 0,
          joinedAt: Date.now(),
        },
      ],
    };

    setSquads(prev => [newSquad, ...prev]);
    setUser(prev => ({ ...prev, activeSquadId: newSquad.id }));

    addSitrep('squad_created', 'NEW PLATOON COMMISSIONED', `Operative ${user.callsign} established ${newSquad.name} (${newSquad.callsignTag}).`);
    tacticalAudio.playRadioSquelch();
  };

  const joinSquad = (squadId: string) => {
    setSquads(prev => prev.map(s => {
      if (s.id !== squadId) return s;
      if (s.members.some(m => m.uid === user.uid)) return s;

      const newMember = {
        uid: user.uid,
        callsign: user.callsign,
        avatar: user.avatar,
        rank: user.rank,
        role: 'Recruit' as const,
        status: user.status,
        currentObjective: user.currentObjective,
        minutesStudiedToday: 0,
        joinedAt: Date.now(),
      };

      return {
        ...s,
        memberCount: s.memberCount + 1,
        members: [...s.members, newMember],
      };
    }));

    setUser(prev => ({ ...prev, activeSquadId: squadId }));
    const targetSquad = squads.find(s => s.id === squadId);
    if (targetSquad) {
      addSitrep('salute_broadcast', 'OPERATIVE TRANSFERRED', `${user.callsign} reported for duty with ${targetSquad.name}.`);
    }
    tacticalAudio.playRadioSquelch();
  };

  const leaveSquad = (squadId: string) => {
    setSquads(prev => prev.map(s => {
      if (s.id !== squadId) return s;
      return {
        ...s,
        memberCount: Math.max(0, s.memberCount - 1),
        members: s.members.filter(m => m.uid !== user.uid),
      };
    }));

    setUser(prev => ({ ...prev, activeSquadId: null }));
    tacticalAudio.playClick();
  };

  const sendSquadMessage = (text: string, isUrgent = false) => {
    if (!text.trim() || !user.activeSquadId) return;

    const newMessage: TacticalMessage = {
      id: `msg_${Date.now()}`,
      squadId: user.activeSquadId,
      senderId: user.uid,
      senderCallsign: user.callsign,
      senderRank: user.rank,
      senderAvatar: user.avatar,
      text: text.trim(),
      timestamp: Date.now(),
      isUrgent,
    };

    setSquadMessages(prev => [...prev, newMessage]);
    tacticalAudio.playRadioSquelch();

    if (tacticalSyncChannel) {
      tacticalSyncChannel.postMessage({ type: 'SQUAD_MSG', payload: newMessage });
    }
  };

  // Bunker Actions
  const triggerRadioCheck = () => {
    const check: RadioCheck = {
      id: `check_${Date.now()}`,
      initiatedAt: Date.now(),
      expiresAt: Date.now() + 45000,
      timeRemainingSeconds: 45,
      active: true,
    };
    setRadioCheck(check);
    setBunkerOperatives(prev => prev.map(op => {
      if (op.uid === user.uid) {
        return { ...op, focusShield: 'radio_check' };
      }
      return op;
    }));
    tacticalAudio.playRadioCheckAlert();
  };

  const confirmRadioCheck = () => {
    if (!radioCheck) return;
    tacticalAudio.playRadioConfirmed();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#3b82f6', '#14b8a6'],
    });

    // Grant +25 discipline XP
    setUser(prev => {
      const nextXp = prev.xp + 25;
      const nextRank = getRankFromXp(nextXp).name;
      return {
        ...prev,
        xp: nextXp,
        rank: nextRank,
      };
    });

    setBunkerOperatives(prev => prev.map(op => {
      if (op.uid === user.uid) {
        return { ...op, focusShield: 'active', lastCheckIn: Date.now() };
      }
      return op;
    }));

    addSitrep(
      'radio_check_passed',
      '🫡 RADIO CHECK VERIFIED',
      `Operative ${user.callsign} verified active workstation presence on target. (+25 XP)`
    );

    setRadioCheck(null);
  };

  const startBunkerSync = (objective: string, minutes: number) => {
    startSession(objective, 'deep_work', minutes, user.activeSquadId || undefined);
    
    // Sync all bunker operatives to this duration
    setBunkerOperatives(prev => prev.map(op => ({
      ...op,
      targetSeconds: minutes * 60,
      elapsedSeconds: 0,
      focusShield: 'active',
      lastCheckIn: Date.now(),
    })));

    addSitrep(
      'bunker_sync',
      '⚡ SQUAD BUNKER SYNCHRONIZED',
      `All bunker operatives synchronized into a ${minutes}-min deep study block: "${objective}". Perimeter locked down!`
    );

    tacticalAudio.playMissionStart();
  };

  const sendBunkerReaction = (targetUid: string, emoji: string) => {
    setBunkerOperatives(prev => prev.map(op => {
      if (op.uid !== targetUid) return op;
      return {
        ...op,
        reactions: [...op.reactions.slice(-4), { id: Date.now().toString(), from: user.callsign, emoji }],
      };
    }));
    tacticalAudio.playClick();
  };

  const toggleBunkerLock = () => {
    if (!isBunkerLocked) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      if ('wakeLock' in navigator && (navigator as unknown as { wakeLock?: { request: (type: string) => Promise<unknown> } }).wakeLock) {
        (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock.request('screen').catch(() => {});
      }
      setIsBunkerLocked(true);
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsBunkerLocked(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        updateUserCallsign,
        setUserStatus,
        activeSession,
        startSession,
        pauseSession,
        resumeSession,
        finishSession,
        cancelSession,
        squads,
        activeSquad,
        setActiveSquadId,
        createSquad,
        joinSquad,
        leaveSquad,
        squadMessages,
        sendSquadMessage,
        sitreps,
        addSitrep,
        reactToSitrep,
        armoryTasks,
        addArmoryTask,
        toggleArmoryTask,
        deleteArmoryTask,
        isMuted,
        toggleMute,
        activeSoundscape,
        setSoundscape,
        bunkerOperatives,
        radioCheck,
        triggerRadioCheck,
        confirmRadioCheck,
        perimeterBreaches,
        startBunkerSync,
        sendBunkerReaction,
        isBunkerLocked,
        toggleBunkerLock,
        isFirebaseActive,
        firebaseConfig,
        connectFirebase,
        disconnectFirebase,
        activeTab,
        setActiveTab,
        isFirebaseModalOpen,
        setIsFirebaseModalOpen,
        zuluTime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
