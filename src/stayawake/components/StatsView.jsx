import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

function fmtHMS(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function StatsView({ stats, onClear }) {
  // build hourly alertness chart from drowsy events (last 48 h)
  const now = Date.now();
  const hourBuckets = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    events: 0,
  }));
  stats.drowsyEvents
    .filter(e => now - e.ts < 48 * 3600 * 1000)
    .forEach(e => {
      const h = new Date(e.ts).getHours();
      hourBuckets[h].events++;
    });

  const totalDrowsy = stats.drowsyEvents.length;
  const dailyEntries = Object.entries(stats.dailyFocusSeconds)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7);

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total focus', value: fmtHMS(stats.totalFocusSeconds) },
          { label: 'Sessions done', value: stats.sessionsCompleted },
          { label: 'Drowsy events', value: totalDrowsy },
          { label: 'Best streak', value: fmtHMS(stats.longestStreakSeconds) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Alertness by hour chart */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-3">
          Drowsy events by hour (last 48 h)
        </h3>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={hourBuckets} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="evt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#6b7280' }} interval={3} />
            <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid #333', fontSize: 11 }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Area type="monotone" dataKey="events" stroke="#f97316" fill="url(#evt)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily focus */}
      {dailyEntries.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-3">Daily focus (last 7 days)</h3>
          <div className="flex items-end gap-2 h-20">
            {dailyEntries.map(([date, secs]) => {
              const max = Math.max(...dailyEntries.map(([, s]) => s));
              const pct = max ? (secs / max) * 100 : 0;
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-blue-500/70 rounded-sm"
                       style={{ height: `${pct}%`, minHeight: 4 }} />
                  <span className="text-[9px] text-gray-500">{date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={onClear}
        className="text-xs text-gray-600 hover:text-red-400 transition self-center"
      >
        Clear all stats
      </button>
    </div>
  );
}
