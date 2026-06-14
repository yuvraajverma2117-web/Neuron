import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950">
      <div className="container-site py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="6" fill="#C94A1F" />
                <circle cx="7" cy="14" r="2.5" fill="white" />
                <circle cx="21" cy="8.5" r="2.5" fill="white" />
                <circle cx="21" cy="19.5" r="2.5" fill="white" />
                <line x1="9.5" y1="14" x2="18.5" y2="9.5" stroke="white" strokeWidth="1.3" strokeOpacity="0.75" />
                <line x1="9.5" y1="14" x2="18.5" y2="18.5" stroke="white" strokeWidth="1.3" strokeOpacity="0.75" />
              </svg>
              <span className="font-display font-semibold text-base text-stone-900 dark:text-stone-100">Neuron</span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-500 max-w-xs leading-relaxed">
              A self-paced path through neural networks. Intuition first, math second, code third.
              No hype, no paywalls.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono font-medium text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-4">Learn</h3>
            <ul className="space-y-2">
              <li><Link to="/path" className="text-sm text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors duration-150">The Path</Link></li>
              <li><Link to="/playground" className="text-sm text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors duration-150">Playground</Link></li>
              <li><Link to="/library" className="text-sm text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors duration-150">Library</Link></li>
              <li><Link to="/glossary" className="text-sm text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors duration-150">Glossary</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono font-medium text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-4">Site</h3>
            <ul className="space-y-2">
              <li><Link to="/progress" className="text-sm text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors duration-150">Progress</Link></li>
              <li><Link to="/about" className="text-sm text-stone-600 dark:text-stone-400 hover:text-ember-600 dark:hover:text-ember-400 transition-colors duration-150">Method</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-stone-400 dark:text-stone-600 font-mono">
            No tracking. No accounts. Progress saved in your browser.
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-600 font-mono">
            Built for learners who love math.
          </p>
        </div>
      </div>
    </footer>
  );
}
