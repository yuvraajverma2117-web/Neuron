import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MathText from './MathText.jsx';
import { TOPICS, YEARS, DIFFICULTIES } from '../data/questions.js';

const DIFF_BADGE = {
  easy:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  hard:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
        active
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-500'
      }`}
    >
      {label}
    </button>
  );
}

export default function PracticeSession({ allQuestions, initialConfig, bookmarks, notes, onToggleBookmark, onUpdateNote, onRecord, onBack }) {
  const [filters, setFilters] = useState({
    topics: initialConfig?.topic ? [initialConfig.topic] : [],
    diffs:  [],
    years:  [],
  });
  const [queue, setQueue]         = useState([]);
  const [qIdx, setQIdx]           = useState(0);
  const [phase, setPhase]         = useState('filter');   // 'filter' | 'question' | 'done'
  const [answered, setAnswered]   = useState(false);
  const [skipped, setSkipped]     = useState(false);
  const [userAnswer, setAnswer]   = useState('');
  const [showSol, setShowSol]     = useState(false);
  const [sessionStats, setStats]  = useState({ correct: 0, incorrect: 0, skipped: 0 });
  const [showNotes, setShowNotes] = useState(false);

  const filtered = useMemo(() => {
    let qs = allQuestions;
    if (filters.topics.length) qs = qs.filter(q => filters.topics.includes(q.topic));
    if (filters.diffs.length)  qs = qs.filter(q => filters.diffs.includes(q.difficulty));
    if (filters.years.length)  qs = qs.filter(q => filters.years.includes(q.year));
    return qs;
  }, [allQuestions, filters]);

  const toggleFilter = (key, val) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(x => x !== val) : [...prev[key], val],
    }));
  };

  const startSession = useCallback(() => {
    const arr = [...filtered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setQueue(arr);
    setQIdx(0);
    setPhase('question');
    setAnswered(false);
    setSkipped(false);
    setAnswer('');
    setShowSol(false);
    setStats({ correct: 0, incorrect: 0, skipped: 0 });
  }, [filtered]);

  // Auto-start if launched from dashboard with a topic
  useEffect(() => {
    if (initialConfig?.topic && filtered.length > 0) {
      startSession();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const q = queue[qIdx];
  const isBookmarked = q && bookmarks.includes(q.id);

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    const correct = String(userAnswer).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();
    setAnswered(true);
    setStats(prev => ({ ...prev, correct: prev.correct + (correct ? 1 : 0), incorrect: prev.incorrect + (correct ? 0 : 1) }));
    onRecord(q.id, correct, q.topic);
  };

  const handleSkip = () => {
    setSkipped(true);
    setShowSol(true);
    setStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
  };

  const next = () => {
    if (qIdx + 1 >= queue.length) { setPhase('done'); return; }
    setQIdx(i => i + 1);
    setAnswered(false);
    setSkipped(false);
    setAnswer('');
    setShowSol(false);
    setShowNotes(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== 'question') return;
    const onKey = e => {
      const tag = e.target.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      switch (e.key) {
        case 'b': case 'B': if (q) onToggleBookmark(q.id); break;
        case 'n': case 'N': case 'ArrowRight': if (answered || skipped) next(); break;
        case 'Escape': onBack(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, q, answered, skipped, onToggleBookmark, onBack, next]); // eslint-disable-line react-hooks/exhaustive-deps

  const isCorrect = answered && String(userAnswer).trim().toLowerCase() === String(q?.correct_answer).trim().toLowerCase();

  /* ---- FILTER SCREEN ---- */
  if (phase === 'filter') {
    return (
      <div className="view-enter max-w-xl mx-auto space-y-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Topic-wise Practice</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Filter questions and practice at your own pace.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Topic</div>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(t => <FilterChip key={t} label={t} active={filters.topics.includes(t)} onClick={() => toggleFilter('topics', t)} />)}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Difficulty</div>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map(d => <FilterChip key={d} label={d.charAt(0).toUpperCase()+d.slice(1)} active={filters.diffs.includes(d)} onClick={() => toggleFilter('diffs', d)} />)}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Year</div>
            <div className="flex flex-wrap gap-2">
              {YEARS.map(y => <FilterChip key={y} label={String(y)} active={filters.years.includes(y)} onClick={() => toggleFilter('years', y)} />)}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{filtered.length} questions</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">match your filters</span>
          </div>
          <button
            disabled={filtered.length === 0}
            onClick={startSession}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Start Practice
          </button>
        </div>
      </div>
    );
  }

  /* ---- DONE SCREEN ---- */
  if (phase === 'done') {
    const total = sessionStats.correct + sessionStats.incorrect + sessionStats.skipped;
    const acc = total > 0 ? Math.round((sessionStats.correct / (total - sessionStats.skipped)) * 100) : 0;
    return (
      <div className="view-enter max-w-md mx-auto text-center py-16 space-y-6">
        <div className="text-5xl">🎉</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Session Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{total} questions attempted</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{sessionStats.correct}</div>
            <div className="text-xs text-gray-500 mt-0.5">Correct</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{sessionStats.incorrect}</div>
            <div className="text-xs text-gray-500 mt-0.5">Incorrect</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-500">{sessionStats.skipped}</div>
            <div className="text-xs text-gray-500 mt-0.5">Skipped</div>
          </div>
        </div>
        {!isNaN(acc) && <p className="text-gray-600 dark:text-gray-400 font-medium">Accuracy: {acc}%</p>}
        <div className="flex justify-center gap-3">
          <button onClick={onBack} className="px-5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</button>
          <button onClick={() => setPhase('filter')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold">Practice Again</button>
        </div>
      </div>
    );
  }

  /* ---- QUESTION SCREEN ---- */
  if (!q) return null;

  return (
    <div className="view-enter max-w-2xl mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 shrink-0">← Back</button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Q{qIdx + 1} of {queue.length}</span>
            <span>{sessionStats.correct}✓ {sessionStats.incorrect}✗ {sessionStats.skipped}→</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((qIdx + 1) / queue.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Meta */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFF_BADGE[q.difficulty]}`}>{q.difficulty}</span>
            <span className="text-xs text-gray-500">{q.topic}</span>
            <span className="text-xs text-gray-400">· {q.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleBookmark(q.id)}
              className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              {isBookmarked ? '🔖' : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowNotes(n => !n)}
              className={`p-1.5 rounded-lg transition-colors ${showNotes ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="px-6 py-6">
          <div className="text-base sm:text-lg leading-relaxed text-gray-900 dark:text-gray-100 mb-6">
            <MathText text={q.question_text} />
          </div>

          {/* Answer */}
          {!answered && !skipped && (
            <div className="space-y-4">
              {q.answer_type === 'mcq' ? (
                <div className="space-y-2">
                  {q.options?.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all
                        ${userAnswer === opt
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'}`}
                    >
                      <input
                        type="radio"
                        name={`pq-${q.id}`}
                        value={opt}
                        checked={userAnswer === opt}
                        onChange={() => setAnswer(opt)}
                        className="mt-0.5 w-4 h-4 shrink-0"
                      />
                      <span className="text-gray-500 font-medium w-5 shrink-0">{String.fromCharCode(65+i)}.</span>
                      <MathText text={opt} />
                    </label>
                  ))}
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">Integer Answer (0–99)</label>
                  <input
                    type="number"
                    min="0" max="99"
                    value={userAnswer}
                    onChange={e => setAnswer(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && userAnswer.trim()) checkAnswer(); }}
                    placeholder="Enter answer…"
                    className="w-36 px-4 py-2.5 text-xl font-bold text-center rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Check Answer
                </button>
                <button
                  onClick={handleSkip}
                  className="px-5 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Skip & Show Solution
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {(answered || skipped) && (
            <div className="space-y-4">
              {answered && (
                <div className={`flex items-center gap-3 p-4 rounded-xl ${
                  isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                }`}>
                  <span className={`text-2xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>{isCorrect ? '✓' : '✗'}</span>
                  <div>
                    <div className={`font-semibold ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </div>
                    {!isCorrect && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        Correct answer: <span className="font-semibold text-green-600 dark:text-green-400"><MathText text={String(q.correct_answer)} /></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {skipped && !answered && (
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-sm text-gray-600 dark:text-gray-400">
                  Skipped. Correct answer: <span className="font-semibold text-gray-800 dark:text-gray-200"><MathText text={String(q.correct_answer)} /></span>
                </div>
              )}

              {/* Solution */}
              {!showSol ? (
                <button
                  onClick={() => setShowSol(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  View full solution →
                </button>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 text-sm">Solution</h4>
                  <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    <MathText text={q.solution} />
                  </div>
                </div>
              )}

              {/* Notes */}
              {showNotes && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                  <textarea
                    value={notes[q.id] || ''}
                    onChange={e => onUpdateNote(q.id, e.target.value)}
                    placeholder="Add notes…"
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
              )}

              <button
                onClick={next}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                {qIdx + 1 < queue.length ? 'Next Question (N →)' : 'Finish Session'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
