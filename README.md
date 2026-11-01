# BARRACKS // Real-Time Student Study & Accountability Platform

> **"Derive. Optimize. Conquer."** — A high-agency, tactical study bunker and accountability platform built for disciplined students, pre-meds, STEM operatives, and exam prep squads.

![Barracks Platform](https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80)

---

## 🎯 Tactical Capabilities & Architecture

### 1. 🛡️ The Bunker // Live Virtual Study War Room
- **Workstations Grid**: Visual workstations for each squadmate present in the Bunker with real-time status.
- **Focus Shield Integrity**:
  - 🟢 **SHIELD 100%**: Actively locked in on mission.
  - 🟡 **RADIO CHECK PENDING**: Tactical accountability confirmation required.
  - 🔴 **PERIMETER BREACH / AWOL WARNING**: Triggered if the operative switches away from the window or misses a radio check.
- **Periodic "Radio Check" System**: Procedural walkie-talkie alert prompts a 45-second verification ping (*"Confirm on target"*). Confirming awards +25 Discipline XP; missing triggers an automatic squad AWOL alert.
- **Squad Synchronization Protocol**: Any commander or operative can engage a joint focus block (e.g. 50m synchronized session) where all bunker workstations sync and take tactical breaks together.
- **Bunker Lock Mode**: Fullscreen distraction-free HUD that utilizes the HTML5 Screen Wake Lock API to keep monitors/tablets awake beside textbooks.
- **Live Intercom & Reactions**: Quick-transmit tactical dispatches (*"Holding the perimeter"*, *"3m tactical water break"*, *"Radio silence requested"*), or send coffees `☕`, salutes `🫡`, and energy boosts `⚡` directly to comrades' workstations.

### 2. 🛡️ Platoons & Study Squads
- Form, join, and browse discipline-focused study platoons (STEM, Pre-Med, Computer Science, Law, Exam Prep).
- **Live Squad Roster**: Real-time status showing who is currently in combat focus (`IN OPS`), standby, or resting, with their live objective and minutes studied today.
- **Weekly Platoon Target**: Shared hourly combat focus goals with progress tracking.
- **Tactical Radio Comms**: Real-time squad transmission channel with urgent priority dispatches.

### 2. ⏱️ Combat Deployment (Tactical Study Timer)
- Circular tactical HUD timer with progress ring and radar sweep.
- **Multiple Deployment Protocols**:
  - **Pomodoro Ops** (25 min focus / 5 min tactical break)
  - **Deep Recon** (50 min or 90 min uninterrupted deep work blocks)
  - **Open Warfare** (Stopwatch mode for long grinds)
- **Hostile Interception Deflector**: Quick-log distracting impulses into an intercept log to protect working memory.
- **Web Audio Procedural Soundscapes**:
  - *Tactical Rainstorm* (biquad-filtered pink noise)
  - *Bunker Ambiance* (55Hz sub-drone)
  - *40Hz Gamma Focus* (binaural neuro-sync oscillation)
  - *Military Squelch Static* (radio frequency white noise)

### 3. 📡 SITREP // Live Intelligence Radar
- Live situation reports showing what peers are working on in real-time.
- Automatic broadcasts upon deploying to combat, neutralizing armory objectives, or unlocking rank promotions.
- **Tactical Salutes & Reactions**:
  - 🫡 Salute (Honor & Respect)
  - 🔥 Reinforce (Fuel the fire)
  - ⚡ Overclock (Energy boost)
  - 🎯 On Target (Locked in)
  - 🛡️ Defend (Holding the line)
- Manual SITREP broadcasts to transmit field dispatches to the network.

### 4. ⚔️ The Armory // Personal Study Checklists & Arsenal
- Objectives prioritized by **DEFCON Threat Levels**:
  - **DEFCON 1 (Critical)**: Imminent deadline / high stake (+150 XP)
  - **DEFCON 2 (High)**: Major assignment / core concept (+100 XP)
  - **DEFCON 3 (Standard)**: Spaced repetition / flashcard review (+75 XP)
  - **DEFCON 4 (Routine)**: Administrative / notebook audit (+50 XP)
- Instant **"Deploy"** button to load any Armory mission straight into the Combat Timer.
- Satisfying tactical objective neutralization with audio cues and victory confetti.

### 5. 🎖️ Personnel Dossier & Military Rank Ladder
- 10-tier military rank progression from **Cadet** (0 XP) up to **Commander** (18,000+ XP).
- Unlockable combat merit badges:
  - *First Blood*, *Deep Recon*, *7-Day Iron Will*, *Armory Cleared*, *Vanguard Leader*, *Night Ops*, *Centurion*.

---

## ⚡ Real-Time Firebase & Dual Sync Architecture

Barracks is engineered with a **Dual-Mode Sync Engine**:
1. **Zero-Config Local Mesh**: Uses modern HTML5 `BroadcastChannel` for instant, multi-tab real-time sync with procedural mock operatives — works immediately with zero setup!
2. **Live Firebase Firestore & Auth Uplink**: Click the **Firebase Uplink** button in the top HUD or configure `.env` variables to connect directly to your production Firebase project.

### Recommended Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Or request.auth != null
    }
  }
}
```

---

## 🚀 Quickstart

```bash
# Navigate to project directory
cd /Users/ZA/.gemini/antigravity/scratch/barracks

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
