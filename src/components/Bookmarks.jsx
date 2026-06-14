import React, { useState } from 'react';
import MathText from './MathText.jsx';

const DIFF_BADGE = {
  easy:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  hard:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

export default function Bookmarks({ allQuestions, bookmarks, notes, onToggleBookmark, onUpdateNote }) {
  const [selected, setSelected]    = useState(null);
  const [showSol, setShowSol]      = useState({});
  const [filterTopic, setFilter]   = useState('All');

  const bmarkedQs = allQuestions.filter(q => bookmarks.includes(q.id));
  const topics = ['All', ...new Set(bmarkedQs.map(q => q.topic))];
  const visible = filterTopic === 'All' ? bmarkedQs : bmarkedQs.filter(q => q.topic === filterTopic);

  const q = selected ? allQuestions.find(x => x.id === selected) : null;

  return (
    <div className="view-enter space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bookmarks</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{bmarkedQs.length} saved question{bmarkedQs.length !== 1 ? 's' : ''}</p>
      </div>

      {bmarkedQs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🔖</div>
          <p className="font-medium">No bookmarks yet</p>
          <p className="text-sm mt-1">Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">B</kbd> while practicing to bookmark a question.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {/* List */}
          <div className="space-y-4">
            {/* Topic filter */}
            <div className="flex flex-wrap gap-2">
              {topics.map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    filterTopic === t
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {t} {t !== 'All' && `(${bmarkedQs.filter(q => q.topic === t).length})`}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {visible.map(bq => (
                <div
                  key={bq.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                    selected === bq.id ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelected(bq.id === selected ? null : bq.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFF_BADGE[bq.difficulty]}`}>{bq.difficulty}</span>
                        <span className="text-xs text-gray-500">{bq.topic}</span>
                        <span className="text-xs text-gray-400">· {bq.year}</span>
                      </div>
                      <div className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">
                        <MathText text={bq.question_text.slice(0, 120) + (bq.question_text.length > 120 ? '…' : '')} />
                      </div>
                      {notes[bq.id] && (
                        <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-2.5 py-1.5 line-clamp-1">
                          📝 {notes[bq.id]}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); onToggleBookmark(bq.id); if (selected === bq.id) setSelected(null); }}
                      className="text-blue-500 hover:text-red-400 transition-colors shrink-0 p-1"
                      title="Remove bookmark"
                    >
                      🔖
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail pane */}
          <div className="hidden md:block">
            {q ? (
              <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFF_BADGE[q.difficulty]}`}>{q.difficulty}</span>
                  <span className="text-xs text-gray-500">{q.topic} · IOQM {q.year}</span>
                </div>

                <div className="text-base leading-relaxed text-gray-900 dark:text-gray-100">
                  <MathText text={q.question_text} />
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Answer: </span>
                  <span className="font-bold text-green-700 dark:text-green-300"><MathText text={String(q.correct_answer)} /></span>
                </div>

                {showSol[q.id] ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Solution</h4>
                    <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      <MathText text={q.solution} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSol(prev => ({ ...prev, [q.id]: true }))}
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    Show Solution →
                  </button>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes</label>
                  <textarea
                    value={notes[q.id] || ''}
                    onChange={e => onUpdateNote(q.id, e.target.value)}
                    placeholder="Add personal notes…"
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-yellow-400 focus:outline-none resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="sticky top-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-gray-400">
                <div className="text-3xl mb-2">👆</div>
                <p className="text-sm">Select a question to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile detail (shown below the list on small screens) */}
      {q && (
        <div className="md:hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <div className="text-base leading-relaxed text-gray-900 dark:text-gray-100">
            <MathText text={q.question_text} />
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-sm">
            <span className="text-gray-500">Answer: </span>
            <span className="font-bold text-green-700 dark:text-green-300"><MathText text={String(q.correct_answer)} /></span>
          </div>
          {showSol[q.id] ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-sm whitespace-pre-line">
              <MathText text={q.solution} />
            </div>
          ) : (
            <button onClick={() => setShowSol(p => ({ ...p, [q.id]: true }))} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Show Solution →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
