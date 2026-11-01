import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { FirebaseModal } from './components/FirebaseModal';
import { RadarOverview } from './components/RadarOverview';
import { BunkerRoom } from './components/BunkerRoom';
import { CombatDeployment } from './components/CombatDeployment';
import { SitrepsFeed } from './components/SitrepsFeed';
import { SquadsView } from './components/SquadsView';
import { ArmoryChecklist } from './components/ArmoryChecklist';
import { PersonnelDossier } from './components/PersonnelDossier';
import { Shield, Radio, Crosshair, Terminal } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, zuluTime, isFirebaseActive } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#070a0d] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Tactical HUD Header */}
      <Header />

      {/* Main Tactical Operation Zone */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'radar' && <RadarOverview />}
        {activeTab === 'bunker' && <BunkerRoom />}
        {activeTab === 'ops' && <CombatDeployment />}
        {activeTab === 'sitrep' && <SitrepsFeed />}
        {activeTab === 'squads' && <SquadsView />}
        {activeTab === 'armory' && <ArmoryChecklist />}
        {activeTab === 'dossier' && <PersonnelDossier />}
      </main>

      {/* Tactical Bottom Status Ticker */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur py-3 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>BARRACKS NETWORK: OPERATIONAL</span>
            </span>
            <span className="text-slate-700">|</span>
            <span>UPLINK: {isFirebaseActive ? 'FIREBASE FIRESTORE CLOUD' : 'LOCAL MESH REAL-TIME SYNC'}</span>
          </div>

          <div className="flex items-center gap-4">
            <span>SYS CLOCK: {zuluTime}</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">MILITARY SPEC // V2.4</span>
          </div>
        </div>
      </footer>

      {/* Firebase Uplink Configuration Modal */}
      <FirebaseModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
