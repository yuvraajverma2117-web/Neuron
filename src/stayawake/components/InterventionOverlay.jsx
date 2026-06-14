import React, { useEffect, useRef, useState } from 'react';
import MathChallenge from './MathChallenge';
import { useAlarm } from '../hooks/useAlarm';

// Flash colors: bright blue-white to suppress melatonin
const FLASH_COLORS = ['#dbeafe', '#bfdbfe', '#ffffff', '#e0f2fe'];

export default function InterventionOverlay({ level, onDismiss, movementDetected }) {
  const { playGentle, playLoud, playEscalating, stopAll } = useAlarm();
  const [flashIdx, setFlashIdx] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const flashRef = useRef(null);
  const alarmRepeatRef = useRef(null);

  useEffect(() => {
    if (!level) { stopAll(); return; }

    if (level === 'gentle') {
      playGentle();
    } else if (level === 'loud') {
      playLoud();
      setShowChallenge(true);
      // flash
      let i = 0;
      flashRef.current = setInterval(() => {
        setFlashIdx(i++ % FLASH_COLORS.length);
      }, 120);
      // repeat alarm every 4 s until dismissed
      alarmRepeatRef.current = setInterval(() => playLoud(), 4000);
    } else if (level === 'rest') {
      stopAll();
    }

    return () => {
      clearInterval(flashRef.current);
      clearInterval(alarmRepeatRef.current);
      stopAll();
    };
  }, [level]); // eslint-disable-line

  // Movement dismisses gentle alert automatically
  useEffect(() => {
    if (level === 'gentle' && movementDetected) onDismiss();
  }, [movementDetected, level, onDismiss]);

  if (!level) return null;

  const bgFlash = level === 'loud' ? FLASH_COLORS[flashIdx] : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: bgFlash || 'rgba(0,0,0,0.85)' }}
    >
      <div className="bg-gray-900/95 rounded-3xl p-10 max-w-md w-full mx-4 shadow-2xl border border-white/10 flex flex-col items-center gap-6">

        {level === 'gentle' && (
          <>
            <div className="text-5xl">👋</div>
            <h2 className="text-2xl font-bold text-white">Still with me?</h2>
            <p className="text-gray-300 text-center text-sm">
              You seem to be drifting. Move your head or body significantly to dismiss this.
            </p>
            <div className="w-full bg-white/5 rounded-xl p-4 text-center text-gray-400 text-sm">
              Waiting for movement…
              <div className="mt-2 flex justify-center gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                       style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">Or solve a quick problem:</p>
            <MathChallenge onSolved={onDismiss} />
          </>
        )}

        {level === 'loud' && (
          <>
            <div className="text-5xl animate-pulse">⚡️</div>
            <h2 className="text-3xl font-extrabold text-red-400 tracking-wide">WAKE UP!</h2>
            <p className="text-gray-200 text-center text-sm">
              You've drifted off again. Solve the problem below to stop the alarm.
            </p>
            {showChallenge && <MathChallenge onSolved={onDismiss} />}
          </>
        )}

        {level === 'rest' && (
          <>
            <div className="text-5xl">😴</div>
            <h2 className="text-2xl font-bold text-blue-300">You need real rest</h2>
            <p className="text-gray-300 text-center text-sm leading-relaxed">
              You've dozed off {level === 'rest' ? 'multiple times' : ''} in a short window.
              Pushing harder won't help — your brain is genuinely depleted.
            </p>
            <div className="grid grid-cols-3 gap-3 w-full mt-2">
              {[
                { icon: '💤', text: '10–20 min power nap' },
                { icon: '🚿', text: 'Cold water on face' },
                { icon: '🚶', text: '5 min brisk walk' },
              ].map(({ icon, text }) => (
                <div key={text} className="bg-blue-900/40 rounded-xl p-3 text-center text-xs text-blue-200">
                  <div className="text-2xl mb-1">{icon}</div>
                  {text}
                </div>
              ))}
            </div>
            <button
              onClick={onDismiss}
              className="mt-2 px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold"
            >
              I'll take a break
            </button>
          </>
        )}
      </div>
    </div>
  );
}
