import React from 'react';
import { TOPICS, DIFFICULTIES } from '../data/questions.js';

function BarChart({ data, maxVal }) {
  const max = maxVal || Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-3 h-36">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <span className="text-xs font-medium text-gray-500 tabular-nums">{d.value > 0 ? d.value : ''}</span>
          <div className="w-full flex items-end" style={{ height: '100px' }}>
            <div
              className={`w-full ${d.color || 'bg-blue-500'} rounded-t-md transition-all duration-500`}
              style={{ height: `${Math.max((d.value / max) * 100, d.value > 0 ? 4 : 0)}px` }}
            />
          </div>
          <span className="text-xs text-gray-500 text-center truncate w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function HeatCell({ value, max }) {
  const pct = max > 0 ? value / max : 0;
  const alpha = pct === 0 ? 0 : 0.15 + pct * 0.85;
  return (
    <div
      className="rounded-md flex items-center justify-center text-xs font-medium transition-all"
      style={{
        backgroundColor: pct === 0 ? undefined : `rgba(59,130,246,${alpha})`,
        color: pct > 0.6 ? 'white' : undefined,
        height: '40px',
      }}
    >
      {value > 0 ? `${value}%` : '—'}
    </div>
  );
}

export default function Analytics({ sessions, topicStats, allQuestions }) {
  const examSessions = sessions.filter(s => s.mode === 'exam');

  const totalAttempted = Object.values(topicStats).reduce((s, t) => s + (t.attempted || 0), 0);
  const totalCorrect   = Object.values(topicStats).reduce((s, t) => s + (t.correct  || 0), 0);
  const accuracy       = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Topic accuracy bar chart
  const topicChartData = TOPICS.map(t => ({
    label: t.split(' ')[0], // Shorten label
    value: topicStats[t]?.attempted > 0 ? Math.round((topicStats[t].correct / topicStats[t].attempted) * 100) : 0,
    color: 'bg-blue-500',
  }));

  // Topic attempts bar chart
  const topicAttemptData = TOPICS.map(t => ({
    label: t.split(' ')[0],
    value: topicStats[t]?.attempted || 0,
    color: 'bg-indigo-400',
  }));

  // Heatmap: topic × difficulty accuracy
  const heatData = {};
  TOPICS.forEach(topic => {
    heatData[topic] = {};
    DIFFICULTIES.forEach(diff => {
      const qs = allQuestions.filter(q => q.topic === topic && q.difficulty === diff);
      if (!qs.length) { heatData[topic][diff] = null; return; }
      // We don't have per-question stats, just approximate from session data
      // For now use topicStats as a proxy — show topic accuracy
      heatData[topic][diff] = topicStats[topic]?.attempted > 0
        ? Math.round((topicStats[topic].correct / topicStats[topic].attempted) * 100)
        : 0;
    });
  });

  const formatDate = ts => new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  const formatDur = s => { const h = Math.floor(s/3600), m = Math.floor((s%3600)/60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

  return (
    <div className="view-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your performance overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Attempted', value: totalAttempted, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Overall Accuracy', value: `${accuracy}%`, color: 'text-green-600 dark:text-green-400' },
          { label: 'Exams Taken', value: examSessions.length, color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Questions Available', value: allQuestions.length, color: 'text-orange-600 dark:text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Accuracy by topic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5">Accuracy by Topic (%)</h2>
          {totalAttempted > 0 ? (
            <BarChart data={topicChartData} maxVal={100} />
          ) : (
            <div className="h-36 flex items-center justify-center text-sm text-gray-400">No data yet</div>
          )}
        </div>

        {/* Attempts by topic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5">Questions Attempted by Topic</h2>
          {totalAttempted > 0 ? (
            <BarChart data={topicAttemptData} />
          ) : (
            <div className="h-36 flex items-center justify-center text-sm text-gray-400">No data yet</div>
          )}
        </div>
      </div>

      {/* Topic breakdown table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Topic Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="pb-2 font-medium">Topic</th>
                <th className="pb-2 font-medium">Attempted</th>
                <th className="pb-2 font-medium">Correct</th>
                <th className="pb-2 font-medium">Accuracy</th>
                <th className="pb-2 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {TOPICS.map(topic => {
                const { attempted = 0, correct = 0 } = topicStats[topic] || {};
                const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
                const total = allQuestions.filter(q => q.topic === topic).length;
                return (
                  <tr key={topic} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                    <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{topic}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{attempted} / {total}</td>
                    <td className="py-3 text-green-600 dark:text-green-400">{correct}</td>
                    <td className="py-3">
                      <span className={`font-semibold ${acc >= 70 ? 'text-green-600 dark:text-green-400' : acc >= 40 ? 'text-yellow-600 dark:text-yellow-400' : attempted > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                        {attempted > 0 ? `${acc}%` : '—'}
                      </span>
                    </td>
                    <td className="py-3 w-32">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${total > 0 ? (attempted / total) * 100 : 0}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Accuracy Heatmap (Topic × Difficulty)</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[320px]">
            <div className="grid gap-2" style={{ gridTemplateColumns: '120px 1fr 1fr 1fr' }}>
              <div />
              {DIFFICULTIES.map(d => (
                <div key={d} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center capitalize pb-1">{d}</div>
              ))}
              {TOPICS.map(topic => (
                <React.Fragment key={topic}>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center pr-2 truncate">{topic}</div>
                  {DIFFICULTIES.map(diff => (
                    <div key={diff} className="bg-gray-100 dark:bg-gray-700/50 rounded-md">
                      <HeatCell value={heatData[topic]?.[diff] ?? 0} max={100} />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            {totalAttempted === 0 && (
              <p className="text-center text-sm text-gray-400 mt-4">Complete practice sessions to populate the heatmap</p>
            )}
          </div>
        </div>
      </div>

      {/* Session history */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Exam Session History</h2>
        {examSessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No exam sessions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-2 font-medium pr-4">Date & Time</th>
                  <th className="pb-2 font-medium pr-4">Set</th>
                  <th className="pb-2 font-medium pr-4">Score</th>
                  <th className="pb-2 font-medium pr-4">Accuracy</th>
                  <th className="pb-2 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {examSessions.map(s => {
                  const acc = Math.round((s.score.correct / s.score.total) * 100);
                  return (
                    <tr key={s.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                      <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">{formatDate(s.endTime)}</td>
                      <td className="py-2.5 pr-4 text-gray-800 dark:text-gray-200 font-medium">{s.config?.label || '—'}</td>
                      <td className="py-2.5 pr-4">
                        <span className="text-green-600 dark:text-green-400 font-medium">{s.score.correct}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-600 dark:text-gray-400">{s.score.total}</span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className={`font-semibold ${acc >= 70 ? 'text-green-600 dark:text-green-400' : acc >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                          {acc}%
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-500 dark:text-gray-400">{formatDur(s.duration)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
