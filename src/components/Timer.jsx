import React from 'react';

export default function Timer({ remaining, total }) {
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const danger  = remaining < 300;
  const warning = remaining < 600;

  const barColor = danger
    ? 'bg-red-500'
    : warning
    ? 'bg-yellow-500'
    : 'bg-blue-500';

  const textColor = danger
    ? 'text-red-500'
    : warning
    ? 'text-yellow-500 dark:text-yellow-400'
    : 'text-gray-800 dark:text-gray-100';

  return (
    <div>
      <div className={`text-2xl font-mono font-bold tabular-nums text-center ${textColor}`}>
        {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </div>
      <div className="mt-1.5 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {warning && (
        <p className={`text-xs text-center mt-1 font-medium ${textColor}`}>
          {danger ? 'Time almost up!' : 'Less than 10 min left'}
        </p>
      )}
    </div>
  );
}
