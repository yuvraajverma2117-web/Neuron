import React from 'react';
import { motion } from 'framer-motion';

export default function StageCheckpoint({ stageId, text, completed, onToggle }) {
  return (
    <div className="mt-12 rounded-xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-6">
      <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">Stage checkpoint</p>
      <p className="text-base text-stone-700 dark:text-stone-300 mb-5 leading-relaxed">{text}</p>
      <button
        onClick={() => onToggle(stageId)}
        className={`flex items-center gap-3 px-5 py-3 rounded-lg font-body font-medium text-sm transition-all duration-200 ${
          completed
            ? 'bg-sage-500 text-white hover:bg-sage-700'
            : 'bg-ember-600 dark:bg-ember-600 text-white hover:bg-ember-700'
        }`}
        aria-pressed={completed}
      >
        <motion.span
          initial={false}
          animate={{ scale: completed ? [1.2, 1] : 1 }}
          transition={{ duration: 0.2 }}
        >
          {completed ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8l4 4 6-6" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="8" cy="8" r="6" />
            </svg>
          )}
        </motion.span>
        {completed ? 'Stage complete — undo' : 'Mark this stage complete'}
      </button>
    </div>
  );
}
