import React from 'react';
import { Link } from 'react-router-dom';
import { STAGES } from '../data/stages.js';

export default function NotFound() {
  const randomStage = STAGES[Math.floor(Math.random() * STAGES.length)];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center">
      <div className="container-site py-16">
        <div className="max-w-xl">
          {/* Editorial 404 */}
          <div className="relative mb-10">
            <div
              className="stage-bg-num absolute -left-4 -top-8 text-stone-100 dark:text-stone-900 select-none pointer-events-none"
              aria-hidden="true"
            >
              404
            </div>
            <div className="relative">
              <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-4">Not found</p>
              <h1 className="font-display text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-4">
                This page doesn't exist.
              </h1>
              <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed mb-2">
                Which is a good reminder that in gradient descent, not every path leads somewhere useful.
                Sometimes you end up in a flat region with no signal to follow.
              </p>
              <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                The fix: back up to a known-good position and try again.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 font-body font-medium text-sm hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors duration-200"
            >
              Go home
            </Link>
            <Link
              to="/path"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-body font-medium text-sm hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors duration-200"
            >
              The Path
            </Link>
          </div>

          {/* Random stage suggestion */}
          <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
            <p className="text-xs font-mono text-stone-400 dark:text-stone-600 mb-2">Or, start somewhere:</p>
            <Link
              to={`/stages/${randomStage.slug}`}
              className="text-sm font-body font-medium text-ember-700 dark:text-ember-400 hover:underline underline-offset-2"
            >
              Stage {randomStage.id} — {randomStage.title} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
