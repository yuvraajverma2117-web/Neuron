import React, { useState } from 'react';
import MathText from './MathText.jsx';

const STATUS_STYLE = {
  correct:     'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  incorrect:   'bg-red-100   dark:bg-red-900/30   border-red-300   dark:border-red-700',
  unattempted: 'bg-gray-100  dark:bg-gray-700/50   border-gray-300  dark:border-gray-600',
};
const STATUS_ICON = { correct: '✓', incorrect: '✗', unattempted: '—' };
const STATUS_TEXT = { correct: 'text-green-600 dark:text-green-400', incorrect: 'text-red-600 dark:text-red-400', unattempted: 'text-gray-400' };

function ScoreRing({ pct }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
      <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

export default function ExamResults({ session, bookmarks, notes, onToggleBookmark, onUpdateNote, onNewExam, onDashboard }) {
  const [detailIdx, setDetailIdx] = useState(null);
  const [showSolution, setShowSolution] = useState({});
  const [filterStatus, setFilter] = useState('all');

  if (!session || session.answers?.__cancelled) {
    return (
      <div className="view-enter max-w-lg mx-auto text-center py-20 space-y-4">
        <div className="text-5xl">👋</div>
        <h2 className="text-xl font-bold">Exam cancelled</h2>
        <p className="text-gray-500">Your progress was not saved.</p>
        <div className="flex justify-center gap-3">
          <button onClick={onDashboard} className="px-5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium">Dashboard</button>
          <button onClick={onNewExam}  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold">New Exam</button>
        </div>
      </div>
    );
  }

  const { score, detailed } = session;
  const pct = Math.round((score.correct / score.total) * 100);
  const formatDur = s => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return h > 0 ? `${h}h ${m}m ${sec}s` : `${m}m ${sec}s`;
  };

  const filtered = filterStatus === 'all' ? detailed : detailed.filter(q => q.status === filterStatus);
  const q = detailIdx !== null ? filtered[detailIdx] : null;

  return (
    <div className="view-enter max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exam Results</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {session.config.label} · {formatDur(session.duration)}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onNewExam}   className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">New Exam</button>
          <button onClick={onDashboard} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">Dashboard</button>
        </div>
      </div>

      {/* Scorecard */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Ring */}
          <div className="relative shrink-0">
            <ScoreRing pct={pct} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pct}%</span>
              <span className="text-xs text-gray-500">{score.correct}/{score.total}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 w-full grid grid-cols-3 gap-4">
            {[
              { label: 'Correct',     val: score.correct,     color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
              { label: 'Incorrect',   val: score.incorrect,   color: 'text-red-600 dark:text-red-400',   bg: 'bg-red-50 dark:bg-red-900/20' },
              { label: 'Unattempted', val: score.unattempted, color: 'text-gray-500',                    bg: 'bg-gray-100 dark:bg-gray-700/50' },
            ].map(({ label, val, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
                <div className={`text-3xl font-bold ${color}`}>{val}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail view or list */}
      {q !== null ? (
        /* Single question detail */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-lg font-bold ${STATUS_TEXT[q.status]}`}>{STATUS_ICON[q.status]}</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Q{filtered.indexOf(q)+1}</span>
              <span className="text-sm text-gray-500">{q.topic} · {q.year}</span>
            </div>
            <button onClick={() => setDetailIdx(null)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">← Back to list</button>
          </div>

          <div className={`p-4 rounded-xl border ${STATUS_STYLE[q.status]}`}>
            <div className="text-base leading-relaxed text-gray-900 dark:text-gray-100">
              <MathText text={q.question_text} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="text-gray-500 dark:text-gray-400 mb-1">Your answer</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {q.userAnswer ? <MathText text={q.userAnswer} /> : <span className="text-gray-400">Not attempted</span>}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div className="text-gray-500 dark:text-gray-400 mb-1">Correct answer</div>
              <div className="font-semibold text-green-700 dark:text-green-400"><MathText text={String(q.correct_answer)} /></div>
            </div>
          </div>

          {/* Solution */}
          {showSolution[q.id] ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Solution</h4>
              <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                <MathText text={q.solution} />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSolution(prev => ({ ...prev, [q.id]: true }))}
              className="px-4 py-2 rounded-xl border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Show Solution
            </button>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Notes</label>
            <textarea
              value={notes[q.id] || ''}
              onChange={e => onUpdateNote(q.id, e.target.value)}
              placeholder="Add notes…"
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Prev/Next */}
          <div className="flex justify-between">
            <button
              disabled={detailIdx === 0}
              onClick={() => setDetailIdx(i => Math.max(0, i - 1))}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ← Previous
            </button>
            <button
              disabled={detailIdx === filtered.length - 1}
              onClick={() => setDetailIdx(i => Math.min(filtered.length - 1, i + 1))}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        /* Question list */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          {/* Filter */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-1">Show:</span>
            {['all','correct','incorrect','unattempted'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filterStatus === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {f} {f !== 'all' && `(${detailed.filter(q => q.status === f).length})`}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((qx, i) => (
              <button
                key={qx.id}
                onClick={() => setDetailIdx(i)}
                className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-sm
                  ${STATUS_STYLE[qx.status]}`}
              >
                <span className={`font-bold text-base shrink-0 mt-0.5 ${STATUS_TEXT[qx.status]}`}>
                  {STATUS_ICON[qx.status]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    Q{i + 1}: <MathText text={qx.question_text.slice(0, 80) + (qx.question_text.length > 80 ? '…' : '')} />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{qx.topic} · {qx.difficulty} · {qx.year}</div>
                </div>
                <div className="text-xs text-gray-400 shrink-0">View →</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
