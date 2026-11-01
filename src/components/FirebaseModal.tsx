import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Radio, Check, X, Server, Database, Key, ExternalLink } from 'lucide-react';
import { FirebaseConfig } from '../services/firebase';

export const FirebaseModal: React.FC = () => {
  const { 
    isFirebaseModalOpen, 
    setIsFirebaseModalOpen, 
    isFirebaseActive, 
    firebaseConfig, 
    connectFirebase, 
    disconnectFirebase 
  } = useApp();

  const [apiKey, setApiKey] = useState(firebaseConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(firebaseConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(firebaseConfig?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(firebaseConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(firebaseConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(firebaseConfig?.appId || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isFirebaseModalOpen) return null;

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      setStatusMessage('Error: API Key and Project ID are required.');
      return;
    }

    const config: FirebaseConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim() || '123456789',
      appId: appId.trim() || '1:123456789:web:abcdef',
    };

    const success = connectFirebase(config);
    if (success) {
      setStatusMessage('Uplink Established: Connected to Firebase Firestore & Auth.');
      setTimeout(() => {
        setIsFirebaseModalOpen(false);
      }, 1200);
    } else {
      setStatusMessage('Connection failed. Reverting to Local Broadcast Sync.');
    }
  };

  const handleDisconnect = () => {
    disconnectFirebase();
    setStatusMessage('Disconnected. Switched to Local Broadcast Mesh.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-lg font-bold font-mono tracking-wider text-slate-100 uppercase">
              Tactical Firebase Uplink // Config
            </h2>
          </div>
          <button
            onClick={() => setIsFirebaseModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Uplink Status Banner */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isFirebaseActive ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-cyan-400 shadow-[0_0_10px_#06b6d4]'}`} />
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Current Mode: </span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {isFirebaseActive ? 'ONLINE // LIVE CLOUD FIRESTORE' : 'LOCAL MESH // BROADCAST CHANNEL SYNC'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {isFirebaseActive ? 'CLOUD UPLINK' : 'ZERO-CONFIG READY'}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          <p className="text-xs text-slate-400 leading-relaxed">
            Barracks works <strong className="text-emerald-400">immediately out-of-the-box</strong> using a multi-tab real-time Broadcast Channel. 
            To sync globally across remote devices, plug in your project credentials from the{' '}
            <a 
              href="https://console.firebase.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-cyan-400 underline inline-flex items-center gap-0.5 hover:text-cyan-300"
            >
              Firebase Console <ExternalLink className="w-3 h-3" />
            </a>.
          </p>

          <form onSubmit={handleConnect} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  API Key <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Project ID <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Database className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="barracks-ops-101"
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  placeholder="barracks-ops.firebaseapp.com"
                  value={authDomain}
                  onChange={e => setAuthDomain(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Storage Bucket
                </label>
                <input
                  type="text"
                  placeholder="barracks-ops.appspot.com"
                  value={storageBucket}
                  onChange={e => setStorageBucket(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  App ID
                </label>
                <input
                  type="text"
                  placeholder="1:123456789:web:abcdef"
                  value={appId}
                  onChange={e => setAppId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Messaging Sender ID
                </label>
                <input
                  type="text"
                  placeholder="123456789012"
                  value={messagingSenderId}
                  onChange={e => setMessagingSenderId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {statusMessage && (
              <div className="p-3 text-xs font-mono rounded bg-slate-950 border border-emerald-500/40 text-emerald-300">
                {statusMessage}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {isFirebaseActive ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-4 py-2 text-xs font-mono font-semibold uppercase text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/60 rounded transition"
                >
                  Disconnect Uplink
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setApiKey('DEMO-API-KEY-BARRACKS');
                    setProjectId('barracks-live-demo');
                    setStatusMessage('Sample parameters populated. You can also paste your production Firebase keys.');
                  }}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 underline"
                >
                  Auto-fill Test Values
                </button>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFirebaseModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-300 hover:bg-slate-800 rounded transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                >
                  Establish Uplink
                </button>
              </div>
            </div>
          </form>

          {/* Firestore Security Rules Info */}
          <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 mb-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recommended Firestore Rules:</span>
            </div>
            <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800/80">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Or request.auth != null for authenticated
    }
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
