import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

// Loss landscape: L(w) = (w - 2.67)^2 + noise term for flavor
function loss(w) {
  return (w - 2.67) ** 2 * 0.8 + 0.05;
}
function dLoss(w) {
  return 2 * (w - 2.67) * 0.8;
}

const W_MIN = -2;
const W_MAX = 7;
const L_SCALE = 5.5;

function wToX(w, width) {
  return ((w - W_MIN) / (W_MAX - W_MIN)) * (width - 40) + 20;
}
function lToY(l, height) {
  return (height - 20) - (l / L_SCALE) * (height - 40);
}

export default function ErrorBowl({ compact = false }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const [w, setW] = useState(-1.5);
  const [lr, setLr] = useState(0.3);
  const [steps, setSteps] = useState(0);
  const [history, setHistory] = useState([]);
  const [running, setRunning] = useState(false);
  const [converged, setConverged] = useState(false);
  const rafRef = useRef(null);
  const wRef = useRef(w);
  const stepsRef = useRef(0);
  const histRef = useRef([]);

  wRef.current = w;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const isDark = document.documentElement.classList.contains('dark');

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = isDark ? '#0D0C09' : '#F5F4F0';
    ctx.fillRect(0, 0, W, H);

    // Grid lines (subtle)
    ctx.strokeStyle = isDark ? '#2E2A24' : '#E0DDD5';
    ctx.lineWidth = 1;
    for (let wv = W_MIN; wv <= W_MAX; wv += 1) {
      const x = wToX(wv, W);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Loss curve
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#A8A298' : '#857E72';
    ctx.lineWidth = 2.5;
    for (let i = 0; i <= W; i++) {
      const wv = W_MIN + (i / W) * (W_MAX - W_MIN);
      const lv = loss(wv);
      const x = wToX(wv, W);
      const y = lToY(lv, H);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // History trail
    if (histRef.current.length > 1) {
      for (let i = 1; i < histRef.current.length; i++) {
        const prev = histRef.current[i - 1];
        const curr = histRef.current[i];
        const alpha = 0.15 + 0.85 * (i / histRef.current.length);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(201, 74, 31, ${alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.moveTo(wToX(prev, W), lToY(loss(prev), H));
        ctx.lineTo(wToX(curr, W), lToY(loss(curr), H));
        ctx.stroke();
      }
    }

    // Minimum marker
    const minX = wToX(2.67, W);
    const minY = lToY(loss(2.67), H);
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#4A7C59' : '#4A7C59';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.moveTo(minX, 0);
    ctx.lineTo(minX, H);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#4A7C59';
    ctx.beginPath();
    ctx.arc(minX, minY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Ball (current position)
    const ballX = wToX(wRef.current, W);
    const ballY = lToY(loss(wRef.current), H);

    // Shadow
    ctx.beginPath();
    ctx.fillStyle = 'rgba(201, 74, 31, 0.15)';
    ctx.ellipse(ballX, H - 8, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ball
    const grad = ctx.createRadialGradient(ballX - 3, ballY - 3, 1, ballX, ballY, 12);
    grad.addColorStop(0, '#E85E20');
    grad.addColorStop(1, '#7D2C12');
    ctx.beginPath();
    ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Gradient arrow
    const grad_val = dLoss(wRef.current);
    const arrowLen = Math.min(Math.abs(grad_val) * 20, 40);
    const arrowDir = grad_val < 0 ? 1 : -1;
    if (Math.abs(grad_val) > 0.05) {
      ctx.beginPath();
      ctx.strokeStyle = '#FF7A38';
      ctx.lineWidth = 2;
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + arrowDir * arrowLen, ballY);
      ctx.stroke();
      // Arrowhead
      const ax = ballX + arrowDir * arrowLen;
      ctx.beginPath();
      ctx.fillStyle = '#FF7A38';
      ctx.moveTo(ax + arrowDir * 6, ballY);
      ctx.lineTo(ax - arrowDir * 3, ballY - 5);
      ctx.lineTo(ax - arrowDir * 3, ballY + 5);
      ctx.closePath();
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = isDark ? '#857E72' : '#6B6358';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('w*', minX + 6, minY - 8);

    ctx.textAlign = 'left';
    ctx.fillStyle = isDark ? '#A8A298' : '#6B6358';
    ctx.fillText(`w = ${wRef.current.toFixed(3)}`, 16, 20);
    ctx.fillText(`L = ${loss(wRef.current).toFixed(4)}`, 16, 36);

  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    draw();
  }, [w, draw]);

  const step = useCallback(() => {
    const grad = dLoss(wRef.current);
    const newW = Math.max(W_MIN, Math.min(W_MAX, wRef.current - lr * grad));
    wRef.current = newW;
    histRef.current = [...histRef.current, newW].slice(-60);
    stepsRef.current += 1;
    setW(newW);
    setSteps(stepsRef.current);
    setHistory([...histRef.current]);
    if (Math.abs(dLoss(newW)) < 0.005) {
      setConverged(true);
      setRunning(false);
      return true; // converged
    }
    return false;
  }, [lr]);

  useEffect(() => {
    if (running && !reduced) {
      const loop = () => {
        const done = step();
        if (!done) {
          rafRef.current = requestAnimationFrame(loop);
        } else {
          setRunning(false);
        }
      };
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [running, step, reduced]);

  const reset = () => {
    setRunning(false);
    cancelAnimationFrame(rafRef.current);
    const startW = -1.5;
    wRef.current = startW;
    histRef.current = [];
    stepsRef.current = 0;
    setW(startW);
    setSteps(0);
    setHistory([]);
    setConverged(false);
    draw();
  };

  const handleStep = () => {
    setRunning(false);
    cancelAnimationFrame(rafRef.current);
    step();
  };

  return (
    <div className={`rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 overflow-hidden ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-stone-900 dark:text-stone-100 text-base">Error Bowl</h3>
          <p className="text-xs text-stone-500 dark:text-stone-500 mt-0.5">
            The ball rolls downhill — each step is gradient descent
          </p>
        </div>
        {converged && (
          <span className="text-xs font-mono text-sage-700 dark:text-sage-500 bg-sage-100 dark:bg-sage-700/20 px-2.5 py-1 rounded-full">
            Converged in {steps} steps
          </span>
        )}
      </div>

      {/* Canvas */}
      <div className="rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 mb-4" style={{ height: '240px' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          aria-label="Loss landscape visualization showing a parabola with a rolling ball"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <label className="flex items-center justify-between text-xs font-mono text-stone-500 dark:text-stone-500 mb-1.5">
            <span>Learning rate (α)</span>
            <span className="text-ember-600 dark:text-ember-400">{lr.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.01" max="1.2" step="0.01"
            value={lr}
            onChange={e => setLr(+e.target.value)}
            className="w-full h-1.5 rounded-full appearance-none bg-stone-200 dark:bg-stone-800 accent-ember-600 cursor-pointer"
          />
          {lr > 0.9 && (
            <p className="text-xs text-ember-600 dark:text-ember-400 font-mono mt-1">
              Very large — might oscillate!
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleStep}
            disabled={converged}
            className="px-3 py-2 text-xs font-mono rounded-md border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Step
          </button>
          <button
            onClick={() => setRunning(r => !r)}
            disabled={converged}
            className={`px-3 py-2 text-xs font-mono rounded-md border disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 ${
              running
                ? 'border-ember-600 bg-ember-600 text-white hover:bg-ember-700'
                : 'border-ember-600 text-ember-700 dark:text-ember-400 hover:bg-ember-50 dark:hover:bg-ember-900/20'
            }`}
          >
            {running ? 'Pause' : 'Run'}
          </button>
          <button
            onClick={reset}
            className="px-3 py-2 text-xs font-mono rounded-md border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-150"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-4 text-xs font-mono text-stone-500 dark:text-stone-600">
        <span>Steps: <span className="text-stone-700 dark:text-stone-400">{steps}</span></span>
        <span>Loss: <span className="text-stone-700 dark:text-stone-400">{loss(w).toFixed(4)}</span></span>
        <span>|∇L|: <span className="text-stone-700 dark:text-stone-400">{Math.abs(dLoss(w)).toFixed(4)}</span></span>
      </div>
    </div>
  );
}
