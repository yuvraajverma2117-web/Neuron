import React, { useState, useMemo } from 'react';
import { TOPICS, YEARS } from '../data/questions.js';

const DURATION_OPTS = [
  { label: '30 min',  value: 1800  },
  { label: '1 hour',  value: 3600  },
  { label: '2 hours', value: 7200  },
  { label: '3 hours', value: 10800 },
];

export default function ExamSetup({ allQuestions, preferences, onStart, onBack }) {
  const [mode, setMode]           = useState('year');  // 'year' | 'custom'
  const [selectedYear, setYear]   = useState('all');
  const [selectedTopics, setTopics] = useState([]);
  const [selectedDiffs, setDiffs] = useState([]);
  const [duration, setDuration]   = useState(preferences.examDuration || 10800);
  const [customDur, setCustomDur] = useState('');

  const filtered = useMemo(() => {
    let qs = allQuestions;
    if (mode === 'year' && selectedYear !== 'all') {
      qs = qs.filter(q => q.year === Number(selectedYear));
    }
    if (mode === 'custom') {
      if (selectedTopics.length) qs = qs.filter(q => selectedTopics.includes(q.topic));
      if (selectedDiffs.length)  qs = qs.filter(q => selectedDiffs.includes(q.difficulty));
    }
    return qs;
  }, [allQuestions, mode, selectedYear, selectedTopics, selectedDiffs]);

  const shuffled = useMemo(() => {
    const arr = [...filtered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [filtered]);

  const toggleTopic = t => setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleDiff  = d => setDiffs(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const activeDuration = customDur ? Number(customDur) * 60 : duration;

  const handleStart = () => {
    if (!shuffled.length) return;
    onStart({
      questionIds: shuffled.map(q => q.id),
      duration: activeDuration,
      label: mode === 'year' && selectedYear !== 'all' ? `IOQM ${selectedYear}` : 'Custom Set',
    });
  };

  const diffActiveClass = {
    easy:   'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    hard:   'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };

  return (
    <div className="view-enter max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exam Setup</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure your simulation before starting.</p>
      </div>

      {/* Mode selector */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Question Set</label>
          <div className="grid grid-cols-2 gap-3">
            {[['year', 'By Year', 'Select a specific IOQM year'], ['custom', 'Custom Filter', 'Filter by topic & difficulty']].map(([v, l, d]) => (
              <button
                key={v}
                onClick={() => setMode(v)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  mode === v
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                }`}
              >
                <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">{l}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{d}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Year selector */}
        {mode === 'year' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Year</label>
            <div className="flex flex-wrap gap-2">
              {['all', ...YEARS].map(y => {
                const cnt = y === 'all' ? allQuestions.length : allQuestions.filter(q => q.year === y).length;
                return (
                  <button
                    key={y}
                    onClick={() => setYear(String(y))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                      selectedYear === String(y)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-300'
                    }`}
                  >
                    {y === 'all' ? 'All Years' : y}
                    <span className="ml-1.5 text-xs opacity-60">({cnt})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom filters */}
        {mode === 'custom' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Topics</label>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(t => (
                  <button
                    key={t}
                    onClick={() => toggleTopic(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                      selectedTopics.includes(t)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => toggleDiff(d)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 capitalize transition-all ${
                      selectedDiffs.includes(d)
                        ? diffActiveClass[d]
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Duration</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {DURATION_OPTS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => { setDuration(value); setCustomDur(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                duration === value && !customDur
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="5"
            max="360"
            placeholder="Custom (min)"
            value={customDur}
            onChange={e => setCustomDur(e.target.value)}
            className="w-36 px-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-transparent focus:border-blue-500 focus:outline-none"
          />
          <span className="text-sm text-gray-500">minutes</span>
        </div>
      </div>

      {/* Preview & Start */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold text-gray-800 dark:text-gray-200">
              {shuffled.length} question{shuffled.length !== 1 ? 's' : ''} selected
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Duration: {Math.floor(activeDuration / 3600) > 0 ? `${Math.floor(activeDuration / 3600)}h ` : ''}
              {Math.floor((activeDuration % 3600) / 60)}m
            </div>
          </div>
          <button
            onClick={handleStart}
            disabled={shuffled.length === 0}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            Start Exam →
          </button>
        </div>
        {shuffled.length === 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400">No questions match the current filters.</p>
        )}
      </div>
    </div>
  );
}
