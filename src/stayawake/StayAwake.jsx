import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useEAR } from './hooks/useEAR';
import { useDrowsiness } from './hooks/useDrowsiness';
import { useSession } from './hooks/useSession';
import { useStats } from './hooks/useStats';
import StatusBadge from './components/StatusBadge';
import WebcamPreview from './components/WebcamPreview';
import InterventionOverlay from './components/InterventionOverlay';
import PomodoroTimer from './components/PomodoroTimer';
import StatsView from './components/StatsView';

// Movement detection: compare nose-tip Y to saved position when alert fired
const MOVEMENT_THRESHOLD = 0.06;

export default function StayAwake() {
  const videoRef = useRef(null);
  const [camGranted, setCamGranted] = useState(false);
  const [camError, setCamError] = useState('');
  const [tab, setTab] = useState('focus'); // focus | stats
  const [screenPulse, setScreenPulse] = useState(false);

  const { status, metrics, faceDetected, start, stop, setOnDrowsy } = useEAR(videoRef);
  const { interventionLevel, triggerDrowsy, dismiss, reset, eventCount } = useDrowsiness();
  const { stats, recordFocusSeconds, recordDrowsyEvent, updateStreak, clearStats } = useStats();

  // Track movement for gentle-nudge dismissal
  const baseNoseRef = useRef(null);
  const [movementDetected, setMovementDetected] = useState(false);

  // When an intervention fires, snapshot the nose position as baseline
  useEffect(() => {
    if (interventionLevel === 'gentle') {
      baseNoseRef.current = metrics.ear; // we'll use ear proxy; for real movement check body
      setMovementDetected(false);
    }
  }, [interventionLevel]);

  // Detect significant movement via EAR fluctuation (proxy: large face bbox shift not tracked here;
  // instead we watch for sustained high EAR after alert, meaning eyes opened wide = arousal)
  useEffect(() => {
    if (interventionLevel === 'gentle' && metrics.ear > 0.35) {
      setMovementDetected(true);
    }
  }, [metrics.ear, interventionLevel]);

  // Screen pulse on gentle event
  useEffect(() => {
    if (interventionLevel) {
      setScreenPulse(true);
      setTimeout(() => setScreenPulse(false), 600);
    }
  }, [interventionLevel]);

  // Wire drowsy callback
  useEffect(() => {
    setOnDrowsy(() => {
      triggerDrowsy();
      recordDrowsyEvent('auto');
    });
  }, [setOnDrowsy, triggerDrowsy, recordDrowsyEvent]);

  // Session callbacks
  const handleSessionComplete = useCallback(({ focusSeconds }) => {
    recordFocusSeconds(focusSeconds);
  }, [recordFocusSeconds]);

  const session = useSession(handleSessionComplete);

  const requestCam = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCamGranted(true);
      setTimeout(() => start(), 300);
    } catch (e) {
      setCamError(e.message || 'Camera access denied');
    }
  };

  const handleDismiss = useCallback(() => {
    dismiss();
    setMovementDetected(false);
  }, [dismiss]);

  return (
    <div className={`min-h-screen bg-gray-950 text-white transition-all duration-100
      ${screenPulse ? 'brightness-150' : ''}`}>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Stay Awake</h1>
          <p className="text-xs text-gray-500">All processing is local — no video leaves your device.</p>
        </div>
        <div className="flex gap-2">
          {['focus', 'stats'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
                ${tab === t ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              {t === 'focus' ? '🎯 Focus' : '📊 Stats'}
            </button>
          ))}
        </div>
      </header>

      {/* Camera permission gate */}
      {!camGranted ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4">
          <div className="text-6xl">📷</div>
          <h2 className="text-2xl font-bold">Camera access needed</h2>
          <p className="text-gray-400 text-center max-w-sm text-sm">
            Stay Awake uses your webcam to track eye openness and head position.
            All analysis runs entirely in your browser — nothing is uploaded or stored externally.
          </p>
          {camError && <p className="text-red-400 text-sm">{camError}</p>}
          <button onClick={requestCam}
            className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-lg transition">
            Grant Camera Access
          </button>
        </div>
      ) : (
        <main className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6">

          {tab === 'focus' && (
            <>
              {/* Left: status + pomodoro */}
              <div className="flex flex-col gap-5">
                {/* Live status */}
                <div className="flex flex-col items-start gap-3">
                  <StatusBadge
                    status={status}
                    ear={metrics.ear}
                    yawn={metrics.yawn}
                    nod={metrics.nod}
                  />
                  {eventCount > 0 && (
                    <p className="text-xs text-orange-400/80">
                      {eventCount} drowsy event{eventCount > 1 ? 's' : ''} this window
                      {eventCount >= 2 ? ' — next triggers louder alarm' : ''}
                    </p>
                  )}
                </div>

                {/* Pomodoro */}
                <PomodoroTimer
                  phase={session.phase}
                  secondsLeft={session.secondsLeft}
                  pomodoroCount={session.pomodoroCount}
                  task={session.task}
                  setTask={session.setTask}
                  taskDone={session.taskDone}
                  setTaskDone={session.setTaskDone}
                  isRunning={session.isRunning}
                  PHASES={session.PHASES}
                  startWork={session.startWork}
                  pause={session.pause}
                  resume={session.resume}
                  stop={session.stop}
                />

                {/* Quick session stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Focus today', value: (() => {
                      const today = new Date().toISOString().split('T')[0];
                      const s = stats.dailyFocusSeconds[today] || 0;
                      return `${Math.floor(s / 60)}m`;
                    })() },
                    { label: 'Sessions', value: stats.sessionsCompleted },
                    { label: 'Alerts', value: stats.drowsyEvents.length },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-xl py-3 px-2">
                      <div className="text-xl font-bold text-white">{value}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: webcam */}
              <div className="flex flex-col gap-4 items-center md:items-start">
                <WebcamPreview
                  videoRef={videoRef}
                  faceDetected={faceDetected}
                  status={status}
                />
                <p className="text-xs text-gray-600 max-w-[180px]">
                  Keep your face visible in the preview for accurate tracking.
                </p>
              </div>
            </>
          )}

          {tab === 'stats' && (
            <div className="col-span-full">
              <StatsView stats={stats} onClear={clearStats} />
            </div>
          )}
        </main>
      )}

      {/* Intervention overlay */}
      <InterventionOverlay
        level={interventionLevel}
        onDismiss={handleDismiss}
        movementDetected={movementDetected}
      />
    </div>
  );
}
