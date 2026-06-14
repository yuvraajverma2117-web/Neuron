import React, { useState, useMemo } from 'react';
import { LIBRARY_ITEMS } from '../data/library.js';
import VideoEmbed from '../components/ui/VideoEmbed.jsx';

const STAGE_OPTIONS = [
  { value: 'all', label: 'All stages' },
  ...Array.from({ length: 8 }, (_, i) => ({ value: i + 1, label: `Stage ${i + 1}` })),
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'video', label: 'Videos' },
  { value: 'article', label: 'Articles & books' },
];

function LibraryCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  if (item.type === 'article') {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 hover:border-ember-300 dark:hover:border-ember-700 transition-colors duration-200 group"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
            <svg className="text-stone-500 dark:text-stone-400 group-hover:text-ember-600 transition-colors" width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-ember-700 dark:group-hover:text-ember-400 transition-colors mb-0.5">
              {item.title}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-500 mb-1">{item.creator}</p>
            {item.note && <p className="text-xs text-stone-500 dark:text-stone-500 italic">{item.note}</p>}
            <div className="flex flex-wrap gap-1 mt-2">
              {item.stages.map(s => (
                <span key={s} className="text-xs font-mono text-stone-400 dark:text-stone-600 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">Stage {s}</span>
              ))}
            </div>
          </div>
          <svg className="flex-shrink-0 text-stone-400 group-hover:text-ember-500 transition-colors" width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2">
            <path d="M3 11L11 3M11 3H6M11 3v5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </a>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
      {expanded ? (
        <VideoEmbed {...item} />
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-left p-5 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors duration-150 group"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-ember-100 dark:bg-ember-900/20 flex items-center justify-center">
              <svg className="text-ember-600 dark:text-ember-400" width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm3.5 10.5l-5 3A.5.5 0 018 13V7a.5.5 0 01.5-.5l5 3a.5.5 0 010 .86v.14z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-ember-700 dark:group-hover:text-ember-400 transition-colors mb-0.5">
                {item.title}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-500 mb-1">{item.creator} · {item.duration}</p>
              {item.note && <p className="text-xs text-stone-500 dark:text-stone-500 italic">{item.note}</p>}
              <div className="flex flex-wrap gap-1 mt-2">
                {item.stages.map(s => (
                  <span key={s} className="text-xs font-mono text-stone-400 dark:text-stone-600 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">Stage {s}</span>
                ))}
              </div>
            </div>
            <span className="text-xs font-mono text-ember-600 dark:text-ember-400 flex-shrink-0 mt-0.5">Embed →</span>
          </div>
        </button>
      )}
    </div>
  );
}

export default function Library() {
  const [stageFilter, setStageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return LIBRARY_ITEMS.filter(item => {
      const matchStage = stageFilter === 'all' || item.stages.includes(Number(stageFilter));
      const matchType = typeFilter === 'all' || item.type === typeFilter;
      return matchStage && matchType;
    });
  }, [stageFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container-site py-16">

        <div className="mb-10">
          <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">Curated resources</p>
          <h1 className="font-display text-5xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-4">
            Library
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-prose">
            Every video and reading recommended across the path.
            Filtered by stage and type. Chosen deliberately, not comprehensively.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-stone-400 dark:text-stone-600">Stage:</span>
            {STAGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setStageFilter(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 ${
                  stageFilter === opt.value
                    ? 'bg-ember-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-stone-400 dark:text-stone-600">Type:</span>
            {TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTypeFilter(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 ${
                  typeFilter === opt.value
                    ? 'bg-stone-800 dark:bg-stone-200 text-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-3">
          <span className="text-xs font-mono text-stone-400 dark:text-stone-600">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-stone-400 dark:text-stone-600 font-body">No items match these filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
