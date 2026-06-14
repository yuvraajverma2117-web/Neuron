import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STAGES } from '../data/stages.js';
import { useProgress } from '../hooks/useProgress.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

function StageNode({ stage, index, completed, isCurrent, reduced }) {
  const isLast = index === STAGES.length - 1;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-5"
    >
      {/* Vertical connector */}
      {!isLast && (
        <div className="absolute left-[18px] top-10 bottom-0 w-px">
          <div
            className="w-full transition-all duration-700"
            style={{
              background: completed
                ? '#C94A1F'
                : 'linear-gradient(to bottom, #D5D1C8, transparent)',
              height: '100%',
            }}
          />
        </div>
      )}

      {/* Circle */}
      <Link
        to={`/stages/${stage.slug}`}
        className="flex-shrink-0 relative z-10"
        aria-label={`Stage ${stage.id}: ${stage.title}`}
      >
        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          completed
            ? 'bg-ember-600 border-ember-600 hover:bg-ember-700 hover:border-ember-700'
            : isCurrent
            ? 'bg-stone-50 dark:bg-stone-900 border-ember-600 dark:border-ember-400 hover:bg-ember-50 dark:hover:bg-ember-900/20'
            : 'bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 hover:border-ember-400 dark:hover:border-ember-600'
        }`}>
          {completed ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7l3 3 5-5" />
            </svg>
          ) : (
            <span className={`text-xs font-mono font-semibold ${
              isCurrent ? 'text-ember-600 dark:text-ember-400' : 'text-stone-500 dark:text-stone-500'
            }`}>{stage.id}</span>
          )}
        </div>
      </Link>

      {/* Content */}
      <Link
        to={`/stages/${stage.slug}`}
        className="flex-1 pb-10 group"
      >
        <div className={`rounded-xl border p-5 transition-all duration-200 ${
          isCurrent
            ? 'border-ember-200 dark:border-ember-800 bg-ember-50 dark:bg-ember-900/10 hover:border-ember-400 dark:hover:border-ember-600'
            : completed
            ? 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 hover:border-ember-200 dark:hover:border-ember-800'
            : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
        }`}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-ember-600 dark:text-ember-400 bg-ember-100 dark:bg-ember-900/30 px-2 py-0.5 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-ember-600 dark:bg-ember-400 animate-pulse" />
                    Up next
                  </span>
                )}
                {completed && (
                  <span className="text-xs font-mono text-sage-600 dark:text-sage-500 bg-sage-100 dark:bg-sage-700/20 px-2 py-0.5 rounded-full">
                    Complete
                  </span>
                )}
              </div>
              <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100 group-hover:text-ember-700 dark:group-hover:text-ember-400 transition-colors duration-150">
                {stage.title}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-500 mt-0.5">{stage.subtitle}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-mono text-stone-400 dark:text-stone-600">{stage.estimatedMinutes}m</span>
            </div>
          </div>

          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-3 line-clamp-2">
            {stage.goal}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {stage.keyTerms.slice(0, 4).map(term => (
              <span
                key={term}
                className="text-xs font-mono text-stone-500 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ThePath() {
  const { isCompleted, completedCount, totalCount, percent, nextStage } = useProgress();
  const reduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container-site py-16">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">Learning path</p>
          <h1 className="font-display text-5xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-4">
            The Path
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-prose">
            Eight stages. Follow them in order — each one builds on the last.
            Skip nothing; everything here earns its place.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-12 p-5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-body text-stone-700 dark:text-stone-300">
              {completedCount === 0
                ? 'Not started yet'
                : completedCount === totalCount
                ? 'Path complete'
                : `${completedCount} of ${totalCount} stages complete`
              }
            </span>
            <span className="text-sm font-mono text-ember-600 dark:text-ember-400 font-semibold">{percent}%</span>
          </div>
          <div className="h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-ember-600 dark:bg-ember-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          {nextStage && (
            <p className="text-xs font-mono text-stone-500 dark:text-stone-500 mt-2">
              Next: Stage {nextStage.id} — {nextStage.title}
            </p>
          )}
        </div>

        {/* Stages */}
        <div className="max-w-2xl">
          {STAGES.map((stage, i) => (
            <StageNode
              key={stage.id}
              stage={stage}
              index={i}
              completed={isCompleted(stage.id)}
              isCurrent={nextStage?.id === stage.id}
              reduced={reduced}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-6 p-5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-2xl">
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
            Want to explore before committing to the path?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/playground"
              className="text-sm font-body font-medium text-ember-700 dark:text-ember-400 hover:underline underline-offset-2"
            >
              Try the interactive demos →
            </Link>
            <Link
              to="/glossary"
              className="text-sm font-body text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            >
              Browse the glossary
            </Link>
            <Link
              to="/library"
              className="text-sm font-body text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            >
              See the video library
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
