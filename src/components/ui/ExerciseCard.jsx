import React, { useState } from 'react';

export default function ExerciseCard({ number, exercise }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
      <div className="bg-stone-50 dark:bg-stone-900 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ember-600 text-white text-xs font-mono font-medium flex items-center justify-center mt-0.5">
            {number}
          </span>
          <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">{exercise.prompt}</p>
        </div>
      </div>

      {exercise.answer && (
        <div className="border-t border-stone-200 dark:border-stone-800">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full px-5 py-3 text-left text-xs font-mono text-stone-500 dark:text-stone-500 hover:text-ember-600 dark:hover:text-ember-400 hover:bg-ember-50 dark:hover:bg-ember-900/10 transition-colors duration-150"
            >
              Show answer →
            </button>
          ) : (
            <div className="px-5 py-4 bg-sage-100 dark:bg-stone-900">
              <p className="text-xs font-mono text-sage-700 dark:text-sage-500 uppercase tracking-widest mb-2">Answer</p>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-mono">{exercise.answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
