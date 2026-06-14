import React from 'react';
import { TOPICS } from '../data/questions.js';

function StatCard({ label, value, sub, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    green:  'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
  };
  return (
    <div className={`rounded-xl p-5 ${colors[color]}`}>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      <div className="text-sm font-medium mt-1 opacity-80">{label}</div>
      {sub && <div className="text-xs mt-0.5 opacity-60">{sub}</div>}
    </div>
  );
}

function TopicBar({ topic, stats }) {
  const { attempted = 0, correct = 0 } = stats[topic] || {};
  const pct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700 dark:text-gray-300">{topic}</span>
        <span className="text-gray-500 dark:text-gray-400">
          {attempted > 0 ? `${pct}% (${correct}/${attempted})` : '—'}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard({ allQuestions, sessions, bookmarks, topicStats, onStartExam, onStartPractice, setView }) {
  const examSessions = sessions.filter(s => s.mode === 'exam');
  const totalAttempted = Object.values(topicStats).reduce((sum, t) => sum + (t.attempted || 0), 0);
  const totalCorrect   = Object.values(topicStats).reduce((sum, t) => sum + (t.correct  || 0), 0);
  const accuracy       = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const recentSessions = examSessions.slice(0, 5);

  const formatDate = ts => new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
  const formatDuration = secs => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="view-enter space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">IOQM Practice</h1>
        <p className="text-blue-100 text-sm sm:text-base mb-6">
          Train for the Indian Olympiad Qualifier in Mathematics
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onStartExam}
            className="px-5 py-2.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Start Exam Simulation
          </button>
          <button
            onClick={() => onStartPractice(null)}
            className="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-colors text-sm"
          >
            Topic-wise Practice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Questions Attempted" value={totalAttempted} color="blue" />
        <StatCard label="Accuracy" value={`${accuracy}%`} color="green" />
        <StatCard label="Exams Taken" value={examSessions.length} color="yellow" />
        <StatCard label="Bookmarks" value={bookmarks.length} color="purple" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Topic Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">Performance by Topic</h2>
          <div className="space-y-4">
            {TOPICS.map(t => <TopicBar key={t} topic={t} stats={topicStats} />)}
          </div>
        </div>

        {/* Quick Practice by Topic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">Quick Practice</h2>
          <div className="grid grid-cols-2 gap-3">
            {TOPICS.map(topic => {
              const count = allQuestions.filter(q => q.topic === topic).length;
              const stat  = topicStats[topic] || {};
              const pct   = stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : null;
              return (
                <button
                  key={topic}
                  onClick={() => onStartPractice({ topic })}
                  className="text-left p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{topic}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{count} questions</div>
                  {pct !== null && (
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">{pct}% accuracy</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Exam Sessions</h2>
            <button onClick={() => setView('analytics')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-2 font-medium pr-4">Date</th>
                  <th className="pb-2 font-medium pr-4">Questions</th>
                  <th className="pb-2 font-medium pr-4">Score</th>
                  <th className="pb-2 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                    <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{formatDate(s.endTime)}</td>
                    <td className="py-2.5 pr-4 text-gray-800 dark:text-gray-200">{s.score.total}</td>
                    <td className="py-2.5 pr-4">
                      <span className="text-green-600 dark:text-green-400 font-medium">{s.score.correct}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-gray-600 dark:text-gray-400">{s.score.total}</span>
                      <span className="text-gray-400 ml-1 text-xs">
                        ({Math.round((s.score.correct / s.score.total) * 100)}%)
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-500 dark:text-gray-400">{formatDuration(s.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {recentSessions.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <div className="text-4xl mb-3">📚</div>
          <p className="font-medium">No sessions yet</p>
          <p className="text-sm mt-1">Start an exam or practice session to see your progress here.</p>
        </div>
      )}
    </div>
  );
}
