import React from 'react';

const CONFIG = {
  LOADING:  { label: 'Initialising…', cls: 'bg-gray-700 text-gray-300', dot: 'bg-gray-400' },
  NO_FACE:  { label: 'No face detected', cls: 'bg-yellow-900/60 text-yellow-300', dot: 'bg-yellow-400' },
  ALERT:    { label: 'ALERT', cls: 'bg-emerald-900/60 text-emerald-300', dot: 'bg-emerald-400 animate-pulse' },
  DROWSY:   { label: 'GETTING DROWSY', cls: 'bg-orange-900/60 text-orange-300', dot: 'bg-orange-400 animate-pulse' },
  ASLEEP:   { label: 'FALLING ASLEEP', cls: 'bg-red-900/70 text-red-300', dot: 'bg-red-400 animate-ping' },
};

export default function StatusBadge({ status, ear, yawn, nod }) {
  const cfg = CONFIG[status] || CONFIG.LOADING;
  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 ${cfg.cls}`}>
      <span className={`inline-block w-3 h-3 rounded-full shrink-0 ${cfg.dot}`} />
      <span className="font-bold tracking-widest text-sm uppercase">{cfg.label}</span>
      {status !== 'LOADING' && status !== 'NO_FACE' && (
        <span className="ml-3 text-xs opacity-60 font-mono">
          EAR {(ear ?? 0).toFixed(3)}
          {yawn && ' · YAWN'}
          {nod && ' · NOD'}
        </span>
      )}
    </div>
  );
}
