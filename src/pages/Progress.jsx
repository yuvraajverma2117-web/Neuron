import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STAGES } from '../data/stages.js';
import { useProgress } from '../hooks/useProgress.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

function formatDate(ts) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(ts));
}

export default function Progress() {
  const { completed, isCompleted, toggleStage, reset, completedCount, totalCount, percent, nextStage } = useProgress();
  const reduced = useReducedMotion();
  const [confirmReset, setConfirmReset] = React.useState(false);

  const handleReset = () => {
    if (confirmReset) {
      reset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container-site py-16">

        <div className="mb-12">
          <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">Your journey</p>
          <h1 className="font-display text-5xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-4">
            Progress
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-400 max-w-prose">
            Saved locally in your browser. Nothing is sent anywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-8 max-w-4xl">

          {/* Main progress */}
          <div>
            {/* Summary card */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-stone-100 dark:bg-stone-900">
                  <p className="font-display text-4xl font-bold text-stone-900 dark:text-stone-50">{completedCount}</p>
                  <p className="text-xs font-mono text-stone-500 dark:text-stone-500 mt-1">completed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-stone-100 dark:bg-stone-900">
                  <p className="font-display text-4xl font-bold text-stone-900 dark:text-stone-50">{totalCount - completedCount}</p>
                  <p className="text-xs font-mono text-stone-500 dark:text-stone-500 mt-1">remaining</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-ember-50 dark:bg-ember-900/20">
                  <p className="font-display text-4xl font-bold text-ember-700 dark:text-ember-400">{percent}%</p>
                  <p className="text-xs font-mono text-stone-500 dark:text-stone-500 mt-1">complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-ember-600 dark:bg-ember-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              {percent === 100 ? (
                <p className="text-sm font-body text-sage-700 dark:text-sage-400 text-center font-medium">
                  Path complete. From zero to image classifier.
                </p>
              ) : nextStage ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500 dark:text-stone-500">
                    Next: <span className="text-stone-800 dark:text-stone-200">Stage {nextStage.id} — {nextStage.title}</span>
                  </p>
                  <Link
                    to={`/stages/${nextStage.slug}`}
                    className="text-sm font-body font-medium text-ember-700 dark:text-ember-400 hover:underline underline-offset-2"
                  >
                    Continue →
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Stage list */}
            <div className="space-y-2">
              {STAGES.map((stage, i) => {
                const done = isCompleted(stage.id);
                const completedAt = completed[stage.id]?.completedAt;

                return (
                  <motion.div
                    key={stage.id}
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors duration-150 ${
                      done
                        ? 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900'
                    }`}
                  >
                    <button
                      onClick={() => toggleStage(stage.id)}
                      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        done
                          ? 'bg-ember-600 border-ember-600 hover:bg-ember-700 hover:border-ember-700'
                          : 'border-stone-300 dark:border-stone-700 hover:border-ember-400 dark:hover:border-ember-600'
                      }`}
                      aria-label={done ? `Unmark stage ${stage.id} as complete` : `Mark stage ${stage.id} as complete`}
                    >
                      {done && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6l2.5 2.5 4.5-5" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/stages/${stage.slug}`}
                        className="text-sm font-body font-medium text-stone-900 dark:text-stone-100 hover:text-ember-700 dark:hover:text-ember-400 transition-colors duration-150"
                      >
                        Stage {stage.id} — {stage.title}
                      </Link>
                      <p className="text-xs text-stone-500 dark:text-stone-500 mt-0.5">{stage.subtitle}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {done && completedAt ? (
                        <span className="text-xs font-mono text-stone-400 dark:text-stone-600">{formatDate(completedAt)}</span>
                      ) : (
                        <span className="text-xs font-mono text-stone-400 dark:text-stone-600">{stage.estimatedMinutes}m</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick nav */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-5">
              <h3 className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">Jump to</h3>
              <div className="space-y-1.5">
                <Link to="/path" className="block text-sm font-body text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors">
                  The Path →
                </Link>
                <Link to="/playground" className="block text-sm font-body text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors">
                  Playground →
                </Link>
                <Link to="/library" className="block text-sm font-body text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors">
                  Library →
                </Link>
                <Link to="/glossary" className="block text-sm font-body text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors">
                  Glossary →
                </Link>
              </div>
            </div>

            {/* Reset */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-5">
              <h3 className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-2">Reset progress</h3>
              <p className="text-xs text-stone-500 dark:text-stone-500 mb-3 leading-relaxed">
                Clears all completion markers. Useful if you want to go through the path again.
              </p>
              <button
                onClick={handleReset}
                className={`w-full px-4 py-2.5 rounded-md text-sm font-body font-medium transition-all duration-150 ${
                  confirmReset
                    ? 'bg-rose-500 text-white hover:bg-rose-700'
                    : 'border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
                disabled={completedCount === 0}
              >
                {confirmReset ? 'Confirm reset' : 'Reset all progress'}
              </button>
              {confirmReset && (
                <p className="text-xs text-rose-500 dark:text-rose-400 text-center mt-1.5 font-mono">
                  Click again to confirm
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
