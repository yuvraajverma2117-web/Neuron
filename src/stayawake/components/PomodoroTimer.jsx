import React, { useState } from 'react';

function fmt(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

const PHASE_LABELS = {
  WORK: 'Focus',
  SHORT_BREAK: 'Short Break',
  LONG_BREAK: 'Long Break',
  IDLE: 'Ready',
};

export default function PomodoroTimer({
  phase, secondsLeft, pomodoroCount, task, setTask,
  taskDone, setTaskDone, isRunning, PHASES,
  startWork, pause, resume, stop,
}) {
  const [editing, setEditing] = useState(phase === 'IDLE');

  const handleStart = () => {
    setEditing(false);
    startWork();
  };

  const phaseColor =
    phase === 'WORK' ? 'text-emerald-400' :
    phase === 'SHORT_BREAK' ? 'text-blue-400' :
    phase === 'LONG_BREAK' ? 'text-purple-400' : 'text-gray-400';

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold uppercase tracking-widest ${phaseColor}`}>
          {PHASE_LABELS[phase]}
        </span>
        <span className="text-xs text-gray-500">🍅 ×{pomodoroCount}</span>
      </div>

      <div className="text-center">
        <span className="text-7xl font-mono font-bold text-white tabular-nums">
          {fmt(secondsLeft)}
        </span>
      </div>

      {(phase === 'IDLE' || editing) ? (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400">What will you accomplish this session?</label>
          <input
            type="text"
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="e.g. Solve 5 combinatorics problems"
            className="bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            onKeyDown={e => { if (e.key === 'Enter') handleStart(); }}
          />
          <button
            onClick={handleStart}
            className="mt-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition"
          >
            Start Focus
          </button>
        </div>
      ) : (
        <>
          {task && (
            <div className="flex items-start gap-3 bg-white/5 rounded-xl px-3 py-2">
              <input
                type="checkbox"
                checked={taskDone}
                onChange={e => setTaskDone(e.target.checked)}
                className="mt-0.5 accent-emerald-400"
              />
              <span className={`text-sm ${taskDone ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                {task}
              </span>
            </div>
          )}
          <div className="flex gap-2">
            {isRunning ? (
              <button onClick={pause}
                className="flex-1 py-2 rounded-xl bg-yellow-700/60 hover:bg-yellow-700 text-white text-sm font-semibold transition">
                Pause
              </button>
            ) : (
              <button onClick={resume}
                className="flex-1 py-2 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white text-sm font-semibold transition">
                Resume
              </button>
            )}
            <button onClick={() => { stop(); setEditing(true); }}
              className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition">
              Stop
            </button>
          </div>
        </>
      )}
    </div>
  );
}
