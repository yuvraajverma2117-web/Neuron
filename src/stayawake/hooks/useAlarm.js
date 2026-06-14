import { useRef, useCallback } from 'react';

export function useAlarm() {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  };

  const stopAll = useCallback(() => {
    nodesRef.current.forEach(n => { try { n.stop(); } catch (_) {} });
    nodesRef.current = [];
  }, []);

  // Single beep at given frequency and duration
  const beep = useCallback((freq = 440, duration = 0.3, gain = 0.5, type = 'sine', delay = 0) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
    nodesRef.current.push(osc);
  }, []);

  const playGentle = useCallback(() => {
    stopAll();
    // soft two-tone chime
    beep(523, 0.4, 0.3, 'sine', 0);
    beep(659, 0.4, 0.3, 'sine', 0.45);
  }, [beep, stopAll]);

  const playLoud = useCallback(() => {
    stopAll();
    // unpredictable ascending alarm — randomise pitches so brain can't habituate
    const base = 380 + Math.random() * 200;
    for (let i = 0; i < 6; i++) {
      const freq = base + i * (40 + Math.random() * 60);
      beep(freq, 0.25, 0.8, 'sawtooth', i * 0.28);
    }
  }, [beep, stopAll]);

  const playEscalating = useCallback(() => {
    stopAll();
    // rapid urgent triple-blast, random pitch offset each time
    const offset = Math.random() * 150;
    beep(600 + offset, 0.18, 0.9, 'square', 0);
    beep(750 + offset, 0.18, 0.9, 'square', 0.22);
    beep(900 + offset, 0.25, 0.9, 'square', 0.44);
    beep(600 + offset, 0.5, 0.7, 'sawtooth', 0.72);
  }, [beep, stopAll]);

  return { playGentle, playLoud, playEscalating, stopAll };
}
