import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

// ── Tiny 2-layer network ──────────────────────────────────────────────────

function relu(x) { return Math.max(0, x); }
function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function randomWeight() { return (Math.random() - 0.5) * 2; }

function initNetwork(hiddenSize = 4) {
  // Input: 2, Hidden: hiddenSize, Output: 1
  return {
    W1: Array.from({ length: hiddenSize }, () => [randomWeight(), randomWeight()]),
    b1: Array.from({ length: hiddenSize }, () => randomWeight() * 0.1),
    W2: Array.from({ length: hiddenSize }, () => randomWeight()),
    b2: randomWeight() * 0.1,
  };
}

function forward(net, x) {
  const { W1, b1, W2, b2 } = net;
  const h = W1.map((w, i) => relu(w[0] * x[0] + w[1] * x[1] + b1[i]));
  const out = sigmoid(h.reduce((s, hv, i) => s + W2[i] * hv, b2));
  return { h, out };
}

function bce(y, yhat) {
  const eps = 1e-7;
  return -(y * Math.log(yhat + eps) + (1 - y) * Math.log(1 - yhat + eps));
}

// SGD step
function trainStep(net, points, lr) {
  const { W1, b1, W2, b2 } = net;
  const H = W1.length;

  let totalLoss = 0;

  // Accumulate gradients
  const dW1 = W1.map(() => [0, 0]);
  const db1 = new Array(H).fill(0);
  const dW2 = new Array(H).fill(0);
  let db2 = 0;

  for (const { x, y } of points) {
    const { h, out } = forward(net, x);
    totalLoss += bce(y, out);

    const dOut = out - y; // d(BCE)/d(out) simplified

    db2 += dOut;
    for (let i = 0; i < H; i++) {
      dW2[i] += dOut * h[i];
      const dH = dOut * W2[i] * (h[i] > 0 ? 1 : 0);
      db1[i] += dH;
      dW1[i][0] += dH * x[0];
      dW1[i][1] += dH * x[1];
    }
  }

  const n = points.length;
  return {
    W1: W1.map((w, i) => [w[0] - lr * dW1[i][0] / n, w[1] - lr * dW1[i][1] / n]),
    b1: b1.map((b, i) => b - lr * db1[i] / n),
    W2: W2.map((w, i) => w - lr * dW2[i] / n),
    b2: b2 - lr * db2 / n,
    loss: totalLoss / n,
  };
}

// Generate points: inside circle = 1, outside = 0
function generatePoints(n = 60) {
  return Array.from({ length: n }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random();
    const inside = r < 0.45;
    const radius = inside ? r * 0.42 : 0.48 + Math.random() * 0.48;
    return {
      x: [Math.cos(angle) * radius, Math.sin(angle) * radius],
      y: inside ? 1 : 0,
    };
  });
}

// ── Canvas renderer ───────────────────────────────────────────────────────

function drawScene(canvas, net, points, epoch) {
  const ctx = canvas.getContext('2d');
  const S = canvas.width;
  const isDark = document.documentElement.classList.contains('dark');

  ctx.clearRect(0, 0, S, S);

  // Decision boundary — raster the grid
  const res = 60;
  const cellSize = S / res;
  for (let row = 0; row < res; row++) {
    for (let col = 0; col < res; col++) {
      const nx = (col / res) * 2 - 1;
      const ny = (row / res) * 2 - 1;
      const { out } = forward(net, [nx, ny]);
      const hue = out > 0.5 ? '201, 74, 31' : '74, 124, 89';
      const alpha = isDark ? 0.12 + Math.abs(out - 0.5) * 0.2 : 0.1 + Math.abs(out - 0.5) * 0.18;
      ctx.fillStyle = `rgba(${hue}, ${alpha})`;
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }

  // Decision boundary contour (0.5)
  ctx.strokeStyle = isDark ? 'rgba(200,200,200,0.25)' : 'rgba(100,100,100,0.2)';
  ctx.lineWidth = 1;
  // Quick marching squares approximation: draw where |out - 0.5| < 0.05
  const prevFills = ctx.fillStyle;
  for (let row = 0; row < res; row++) {
    for (let col = 0; col < res; col++) {
      const nx = (col / res) * 2 - 1;
      const ny = (row / res) * 2 - 1;
      const { out } = forward(net, [nx, ny]);
      if (Math.abs(out - 0.5) < 0.06) {
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }

  // Points
  for (const { x, y } of points) {
    const px = ((x[0] + 1) / 2) * S;
    const py = ((x[1] + 1) / 2) * S;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = y === 1 ? '#C94A1F' : (isDark ? '#4A7C59' : '#2F5539');
    ctx.fill();
    ctx.strokeStyle = isDark ? '#0D0C09' : '#FAFAF8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Epoch label
  ctx.fillStyle = isDark ? '#857E72' : '#6B6358';
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`epoch ${epoch}`, S - 8, S - 8);
}

// ── Component ─────────────────────────────────────────────────────────────

export default function LiveClassifier({ compact = false }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef(null);
  const netRef = useRef(initNetwork(4));
  const pointsRef = useRef(generatePoints(70));
  const epochRef = useRef(0);
  const rafRef = useRef(null);
  const lossHistRef = useRef([]);

  const [running, setRunning] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [lr, setLr] = useState(0.5);

  const computeAccuracy = useCallback(() => {
    const pts = pointsRef.current;
    const correct = pts.filter(({ x, y }) => {
      const { out } = forward(netRef.current, x);
      return (out > 0.5 ? 1 : 0) === y;
    }).length;
    return Math.round((correct / pts.length) * 100);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawScene(canvas, netRef.current, pointsRef.current, epochRef.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const s = Math.min(canvas.offsetWidth, 400);
      canvas.width = s;
      canvas.height = s;
      draw();
    });
    ro.observe(canvas);
    const s = Math.min(canvas.offsetWidth, 400);
    canvas.width = s;
    canvas.height = s;
    draw();
    return () => ro.disconnect();
  }, [draw]);

  const doSteps = useCallback((steps = 5) => {
    for (let i = 0; i < steps; i++) {
      const result = trainStep(netRef.current, pointsRef.current, lr);
      netRef.current = { ...result };
      epochRef.current += 1;
      lossHistRef.current.push(result.loss);
    }
    setEpoch(epochRef.current);
    setLoss(lossHistRef.current[lossHistRef.current.length - 1]);
    setAccuracy(computeAccuracy());
    draw();
  }, [lr, computeAccuracy, draw]);

  useEffect(() => {
    if (running && !reduced) {
      const loop = () => {
        doSteps(3);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [running, doSteps, reduced]);

  const reset = () => {
    setRunning(false);
    cancelAnimationFrame(rafRef.current);
    netRef.current = initNetwork(4);
    pointsRef.current = generatePoints(70);
    epochRef.current = 0;
    lossHistRef.current = [];
    setEpoch(0);
    setLoss(null);
    setAccuracy(null);
    draw();
  };

  return (
    <div className={`rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 overflow-hidden ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-stone-900 dark:text-stone-100 text-base">Live Classifier</h3>
          <p className="text-xs text-stone-500 dark:text-stone-500 mt-0.5">
            2-input → 4 hidden → 1 output. Learns to separate
            <span className="text-ember-600 dark:text-ember-400"> inner</span> from
            <span className="text-sage-500"> outer</span> dots
          </p>
        </div>
        {accuracy !== null && (
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full ${
            accuracy > 90
              ? 'text-sage-700 dark:text-sage-500 bg-sage-100 dark:bg-sage-700/20'
              : 'text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800'
          }`}>
            {accuracy}% acc
          </span>
        )}
      </div>

      {/* Canvas */}
      <div className="rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 mb-4">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ display: 'block', aspectRatio: '1' }}
          aria-label="Neural network decision boundary visualization"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-2.5 text-center">
          <p className="text-xs text-stone-500 dark:text-stone-500 mb-0.5 font-mono">epoch</p>
          <p className="text-base font-mono font-semibold text-stone-900 dark:text-stone-100 tabular-nums">{epoch}</p>
        </div>
        <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-2.5 text-center">
          <p className="text-xs text-stone-500 dark:text-stone-500 mb-0.5 font-mono">loss</p>
          <p className="text-base font-mono font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
            {loss !== null ? loss.toFixed(3) : '—'}
          </p>
        </div>
        <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-2.5 text-center">
          <p className="text-xs text-stone-500 dark:text-stone-500 mb-0.5 font-mono">accuracy</p>
          <p className="text-base font-mono font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
            {accuracy !== null ? `${accuracy}%` : '—'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 w-full">
          <label className="flex items-center justify-between text-xs font-mono text-stone-500 dark:text-stone-500 mb-1.5">
            <span>Learning rate</span>
            <span className="text-ember-600 dark:text-ember-400">{lr.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.01" max="2" step="0.01"
            value={lr}
            onChange={e => setLr(+e.target.value)}
            className="w-full h-1.5 rounded-full appearance-none bg-stone-200 dark:bg-stone-800 accent-ember-600 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => doSteps(1)}
            className="px-3 py-2 text-xs font-mono rounded-md border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-150"
          >
            Step
          </button>
          <button
            onClick={() => setRunning(r => !r)}
            className={`px-3 py-2 text-xs font-mono rounded-md border transition-colors duration-150 ${
              running
                ? 'border-ember-600 bg-ember-600 text-white hover:bg-ember-700'
                : 'border-ember-600 text-ember-700 dark:text-ember-400 hover:bg-ember-50 dark:hover:bg-ember-900/20'
            }`}
          >
            {running ? 'Pause' : 'Train'}
          </button>
          <button
            onClick={reset}
            className="px-3 py-2 text-xs font-mono rounded-md border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-150"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
