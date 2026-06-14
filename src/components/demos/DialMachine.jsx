import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

const DIAL_MIN = -5;
const DIAL_MAX = 5;

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function DialKnob({ value, onChange, min, max }) {
  const svgRef = useRef(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startVal = useRef(0);

  const range = max - min;
  const normalized = (value - min) / range;
  const angle = lerp(-135, 135, normalized);

  const handlePointerDown = useCallback((e) => {
    dragging.current = true;
    startY.current = e.clientY;
    startVal.current = value;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [value]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const dy = startY.current - e.clientY;
    const delta = (dy / 200) * range;
    onChange(clamp(startVal.current + delta, min, max));
  }, [min, max, range, onChange]);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <svg
      ref={svgRef}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="cursor-ns-resize touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(value * 100) / 100}
      aria-label="Weight dial"
      tabIndex={0}
      onKeyDown={(e) => {
        const step = 0.1;
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') onChange(clamp(value + step, min, max));
        if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') onChange(clamp(value - step, min, max));
      }}
    >
      {/* Track */}
      <circle cx="60" cy="60" r="44" fill="none" stroke="#D5D1C8" strokeWidth="8" strokeDasharray="230 360" strokeDashoffset="-65" strokeLinecap="round" />
      {/* Active arc */}
      <circle
        cx="60" cy="60" r="44"
        fill="none"
        stroke="#C94A1F"
        strokeWidth="8"
        strokeDasharray={`${230 * normalized} 360`}
        strokeDashoffset="-65"
        strokeLinecap="round"
        className="transition-[stroke-dasharray] duration-100"
      />
      {/* Knob body */}
      <circle cx="60" cy="60" r="28" fill="#F5F4F0" className="dark:fill-stone-800" stroke="#D5D1C8" strokeWidth="1.5" />
      {/* Indicator */}
      <line
        x1="60" y1="60"
        x2={60 + 18 * Math.cos((angle - 90) * Math.PI / 180)}
        y2={60 + 18 * Math.sin((angle - 90) * Math.PI / 180)}
        stroke="#C94A1F"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx="60" cy="60" r="4" fill="#C94A1F" />
    </svg>
  );
}

export default function DialMachine({ compact = false }) {
  const reduced = useReducedMotion();
  const [weight, setWeight] = useState(1.5);
  const [input, setInput] = useState(3);
  const [target] = useState(8);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);

  const output = Math.round(weight * input * 100) / 100;
  const error = Math.round((output - target) * 100) / 100;
  const absError = Math.abs(error);
  const accuracy = Math.max(0, 100 - (absError / target) * 100);

  useEffect(() => {
    if (absError < 0.15 && !solved) {
      setSolved(true);
    } else if (absError >= 0.15 && solved) {
      setSolved(false);
    }
  }, [absError, solved]);

  const handleWeightChange = (val) => {
    setWeight(Math.round(val * 100) / 100);
    setAttempts(a => a + 1);
  };

  const reset = () => {
    setWeight(1.5);
    setAttempts(0);
    setSolved(false);
  };

  return (
    <div className={`rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 overflow-hidden ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-stone-900 dark:text-stone-100 text-base">Dial Machine</h3>
          <p className="text-xs text-stone-500 dark:text-stone-500 mt-0.5">Turn the dial so output = target</p>
        </div>
        {solved && (
          <span className="flex items-center gap-1.5 text-xs font-mono text-sage-700 dark:text-sage-500 bg-sage-100 dark:bg-sage-700/20 px-2.5 py-1 rounded-full">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Got it
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        {/* Equation display */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-3 gap-1 items-center text-center font-mono text-sm">
            <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-3">
              <p className="text-xs text-stone-400 dark:text-stone-600 mb-1">input</p>
              <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{input}</p>
            </div>
            <div className="text-stone-400 dark:text-stone-600 text-xl">×</div>
            <div className={`rounded-lg p-3 border-2 transition-colors duration-200 ${
              solved ? 'border-sage-500 bg-sage-100 dark:bg-sage-700/20' : 'border-ember-600 bg-ember-50 dark:bg-ember-900/20'
            }`}>
              <p className="text-xs text-stone-400 dark:text-stone-600 mb-1">weight</p>
              <p className={`text-2xl font-semibold transition-colors duration-200 ${
                solved ? 'text-sage-700 dark:text-sage-400' : 'text-ember-700 dark:text-ember-400'
              }`}>{weight.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-stone-900 dark:bg-stone-950 rounded-lg p-3 text-center">
              <p className="text-xs text-stone-500 mb-1">output</p>
              <p className={`text-xl font-mono font-semibold transition-colors duration-200 ${
                solved ? 'text-sage-400' : 'text-stone-100'
              }`}>{output.toFixed(2)}</p>
            </div>
            <div className="bg-stone-900 dark:bg-stone-950 rounded-lg p-3 text-center">
              <p className="text-xs text-stone-500 mb-1">target</p>
              <p className="text-xl font-mono font-semibold text-stone-100">{target}</p>
            </div>
          </div>

          {/* Error bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs font-mono text-stone-500 mb-1">
              <span>error: {error > 0 ? '+' : ''}{error.toFixed(2)}</span>
              <span>{attempts} adjustments</span>
            </div>
            <div className="h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  solved ? 'bg-sage-500' : 'bg-ember-600'
                }`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dial */}
        <div className="flex flex-col items-center gap-2">
          <DialKnob value={weight} onChange={handleWeightChange} min={DIAL_MIN} max={DIAL_MAX} />
          <p className="text-xs text-stone-400 dark:text-stone-600 font-mono">drag up/down</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
        <p className="text-xs text-stone-400 dark:text-stone-600 italic">
          {solved
            ? `You found it: weight ≈ ${(target / input).toFixed(2)}`
            : `Hint: if output = weight × input, what weight gives output = ${target}?`
          }
        </p>
        <button
          onClick={reset}
          className="text-xs font-mono text-stone-500 hover:text-ember-600 dark:hover:text-ember-400 transition-colors duration-150"
        >
          reset
        </button>
      </div>
    </div>
  );
}
