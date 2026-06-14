import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GLOSSARY, GLOSSARY_CATEGORIES } from '../data/glossary.js';
import { STAGES } from '../data/stages.js';

function GlossaryEntry({ term, definition, stages, category }) {
  const slug = term.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
  const stageData = stages.map(id => STAGES.find(s => s.id === id)).filter(Boolean);

  return (
    <div
      id={slug}
      className="py-6 border-b border-stone-200 dark:border-stone-800 scroll-mt-24"
    >
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
              {term}
            </h2>
            <span className="text-xs font-mono text-stone-400 dark:text-stone-600 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded uppercase tracking-widest">
              {category}
            </span>
          </div>
          <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed mb-3 max-w-prose">
            {definition}
          </p>
          {stageData.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-stone-400 dark:text-stone-600">Introduced in:</span>
              {stageData.map(stage => (
                <Link
                  key={stage.id}
                  to={`/stages/${stage.slug}`}
                  className="text-xs font-mono text-ember-600 dark:text-ember-400 hover:underline underline-offset-2"
                >
                  Stage {stage.id} — {stage.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Glossary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const searchRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const filtered = useMemo(() => {
    return GLOSSARY
      .filter(item => {
        const matchQuery = !query || item.term.toLowerCase().includes(query.toLowerCase()) || item.definition.toLowerCase().includes(query.toLowerCase());
        const matchCategory = category === 'all' || item.category === category;
        return matchQuery && matchCategory;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [query, category]);

  // Group alphabetically
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(item => {
      const letter = item.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(item);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container-site py-16">

        <div className="mb-10">
          <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">Plain-language definitions</p>
          <h1 className="font-display text-5xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-4">
            Glossary
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-prose">
            Every term you'll encounter, defined without assuming prior knowledge.
            Each entry links back to where it's introduced in the path.
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 pb-8 border-b border-stone-200 dark:border-stone-800">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-600"
              width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5L14 14" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search terms and definitions…"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 text-sm font-body focus:outline-none focus:ring-2 focus:ring-ember-600 dark:focus:ring-ember-400 focus:border-transparent transition-all duration-150"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {GLOSSARY_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors duration-150 ${
                  category === cat.id
                    ? 'bg-ember-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-xs font-mono text-stone-400 dark:text-stone-600 mb-6">
          {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
          {query && ` matching "${query}"`}
        </p>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-stone-400 dark:text-stone-600 font-body">No terms match your search.</p>
            <button onClick={() => { setQuery(''); setCategory('all'); }} className="mt-3 text-sm text-ember-600 dark:text-ember-400 hover:underline underline-offset-2">
              Clear filters
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([letter, items]) => (
            <div key={letter}>
              <div className="flex items-center gap-3 mt-8 mb-2">
                <span className="font-display text-3xl font-bold text-stone-200 dark:text-stone-800">{letter}</span>
                <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
              </div>
              {items.map(item => (
                <GlossaryEntry key={item.term} {...item} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
