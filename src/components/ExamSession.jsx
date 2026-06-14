import React, { useState, useEffect, useRef, useCallback } from 'react';
import MathText from './MathText.jsx';
import Timer from './Timer.jsx';

const DIFF_BADGE = {
  easy:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  hard:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

export default function ExamSession({ questions, config, bookmarks, notes, onToggleBookmark, onUpdateNote, onSubmit }) {
  const [idx, setIdx]             = useState(0);
  const [answers, setAnswers]     = useState({});
  const [visited, setVisited]     = useState(() => new Set([questions[0]?.id]));
  const [showNotes, setShowNotes] = useState(false);
  const [paletteOpen, setPalette] = useState(false);
  const [confirmSubmit, setConfirm] = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const [leaving, setLeaving]     = useState(false);

  const answersRef    = useRef({});
  const elapsedRef    = useRef(0);
  const submittedRef  = useRef(false);
  const intervalRef   = useRef(null);
  const onSubmitRef   = useRef(onSubmit);
  useEffect(() => { onSubmitRef.current = onSubmit; });

  const startTimeRef = useRef(Date.now());

  // Timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      elapsedRef.current = secs;
      setElapsed(secs);
      if (secs >= config.duration && !submittedRef.current) {
        submittedRef.current = true;
        clearInterval(intervalRef.current);
        onSubmitRef.current(answersRef.current, secs);
      }
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveAnswer = useCallback((id, value) => {
    answersRef.current = { ...answersRef.current, [id]: value };
    setAnswers({ ...answersRef.current });
  }, []);

  const navigate = useCallback((to) => {
    if (to < 0 || to >= questions.length) return;
    setIdx(to);
    setVisited(prev => { const n = new Set(prev); n.add(questions[to].id); return n; });
    setPalette(false);
  }, [questions]);

  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    clearInterval(intervalRef.current);
    onSubmitRef.current(answersRef.current, elapsedRef.current);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = e => {
      const tag = e.target.tagName;
      if (tag === 'TEXTAREA') return;
      if (tag === 'INPUT' && e.key === 'Enter') { navigate(idx + 1); return; }
      if (tag === 'INPUT') return;

      switch (e.key) {
        case 'ArrowRight': case 'n': case 'N': navigate(idx + 1); break;
        case 'ArrowLeft':  navigate(idx - 1); break;
        case 'b': case 'B': onToggleBookmark(questions[idx]?.id); break;
        case 's': case 'S': setConfirm(true); break;
        case 'Escape': setPalette(false); setConfirm(false); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, navigate, onToggleBookmark, questions]);

  const q = questions[idx];
  if (!q) return null;

  const remaining  = Math.max(0, config.duration - elapsed);
  const isBookmark = bookmarks.includes(q.id);

  const getStatus = qx => {
    if (answersRef.current[qx.id]?.trim()) return 'answered';
    if (visited.has(qx.id)) return 'visited';
    return 'unseen';
  };

  const answered = Object.values(answersRef.current).filter(a => a?.trim()).length;

  return (
    <div className="fixed inset-0 top-0 flex flex-col bg-gray-50 dark:bg-gray-900" style={{ zIndex: 50 }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPalette(p => !p)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">∑</span>
          <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">{config.label}</span>
        </div>

        <div className="hidden md:block w-48">
          <Timer remaining={remaining} total={config.duration} />
        </div>

        <div className="flex items-center gap-2">
          <div className="md:hidden text-sm font-mono font-bold">
            {String(Math.floor(remaining / 3600)).padStart(2,'0')}:{String(Math.floor((remaining % 3600)/60)).padStart(2,'0')}:{String(remaining % 60).padStart(2,'0')}
          </div>
          <button
            onClick={() => setLeaving(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            title="Leave exam"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">

        {/* Palette Sidebar */}
        <aside className={`
          ${paletteOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          fixed md:relative inset-y-0 left-0 z-30 top-14
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col transition-transform duration-300 ease-in-out shrink-0
        `}>
          {/* Timer in sidebar (desktop) */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Timer remaining={remaining} total={config.duration} />
          </div>

          {/* Status legend */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-1 text-xs text-center">
            <div className="text-green-600 dark:text-green-400">
              <div className="font-bold text-base">{answered}</div>
              Answered
            </div>
            <div className="text-yellow-600 dark:text-yellow-400">
              <div className="font-bold text-base">{visited.size - answered}</div>
              Visited
            </div>
            <div className="text-gray-400">
              <div className="font-bold text-base">{questions.length - visited.size}</div>
              Unseen
            </div>
          </div>

          {/* Question grid */}
          <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((qx, i) => {
                const st = getStatus(qx);
                const isActive = i === idx;
                const isBm = bookmarks.includes(qx.id);
                return (
                  <button
                    key={qx.id}
                    onClick={() => navigate(i)}
                    className={`
                      relative aspect-square rounded-lg text-xs font-semibold flex items-center justify-center
                      transition-all
                      ${isActive ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800' : ''}
                      ${st === 'answered' ? 'bg-green-500 text-white'
                        : st === 'visited' ? 'bg-orange-400 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                    `}
                  >
                    {i + 1}
                    {isBm && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-gray-800" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setConfirm(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Submit Exam (S)
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {paletteOpen && (
          <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setPalette(false)} />
        )}

        {/* Main Question Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Question meta bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Q{idx + 1} <span className="text-gray-400">/ {questions.length}</span>
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFF_BADGE[q.difficulty]}`}>
                {q.difficulty}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{q.topic}</span>
              <span className="text-xs text-gray-400">IOQM {q.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleBookmark(q.id)}
                title="Bookmark (B)"
                className={`p-2 rounded-lg transition-colors ${isBookmark ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                {isBookmark ? '🔖' : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowNotes(n => !n)}
                title="Notes"
                className={`p-2 rounded-lg transition-colors ${showNotes ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable question body */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-5 sm:px-8 py-6">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Question text */}
              <div className="text-base sm:text-lg leading-relaxed text-gray-900 dark:text-gray-100">
                <MathText text={q.question_text} />
              </div>

              {/* MCQ */}
              {q.answer_type === 'mcq' && (
                <div className="space-y-3">
                  {q.options?.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    const sel = answers[q.id] === opt;
                    return (
                      <label
                        key={i}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${sel
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'}`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          checked={sel}
                          onChange={() => saveAnswer(q.id, opt)}
                          className="mt-0.5 w-4 h-4 text-blue-600 shrink-0"
                        />
                        <span className="font-semibold text-gray-500 dark:text-gray-400 w-5 shrink-0">{label}.</span>
                        <span className="text-gray-800 dark:text-gray-200"><MathText text={opt} /></span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Integer */}
              {q.answer_type === 'integer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Integer Answer <span className="text-gray-400">(0–99)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={answers[q.id] ?? ''}
                    onChange={e => saveAnswer(q.id, e.target.value)}
                    placeholder="Enter answer…"
                    className="w-40 px-4 py-3 text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none transition-colors text-center"
                  />
                </div>
              )}

              {/* Notes */}
              {showNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Personal Notes</label>
                  <textarea
                    value={notes[q.id] || ''}
                    onChange={e => onUpdateNote(q.id, e.target.value)}
                    placeholder="Add your scratch work or notes here…"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-yellow-400 focus:outline-none resize-none text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation footer */}
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between shrink-0">
            <button
              onClick={() => navigate(idx - 1)}
              disabled={idx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="text-xs text-gray-400 hidden sm:block">← → navigate · B bookmark · S submit</span>
            <button
              onClick={() => navigate(idx + 1)}
              disabled={idx === questions.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {confirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Submit Exam?</h3>
            <div className="space-y-1.5 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Answered:</span>
                <span className="font-semibold text-green-600">{answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Unanswered:</span>
                <span className="font-semibold text-red-500">{questions.length - answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total:</span>
                <span className="font-semibold">{questions.length}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Confirmation */}
      {leaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Leave Exam?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your progress will be lost. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setLeaving(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium">
                Stay
              </button>
              <button
                onClick={() => {
                  clearInterval(intervalRef.current);
                  // Signal leave back to App via submit with special flag
                  onSubmitRef.current({ __cancelled: true }, elapsedRef.current);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
