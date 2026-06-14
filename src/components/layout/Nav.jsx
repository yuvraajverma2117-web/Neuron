import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme.js';
import { useProgress } from '../../hooks/useProgress.js';

const NAV_LINKS = [
  { to: '/path', label: 'The Path' },
  { to: '/playground', label: 'Playground' },
  { to: '/library', label: 'Library' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/about', label: 'Method' },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="Neuron — home">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect width="28" height="28" rx="6" fill="#C94A1F" />
        <circle cx="7" cy="14" r="2.5" fill="white" />
        <circle cx="21" cy="8.5" r="2.5" fill="white" />
        <circle cx="21" cy="19.5" r="2.5" fill="white" />
        <line x1="9.5" y1="14" x2="18.5" y2="9.5" stroke="white" strokeWidth="1.3" strokeOpacity="0.75" />
        <line x1="9.5" y1="14" x2="18.5" y2="18.5" stroke="white" strokeWidth="1.3" strokeOpacity="0.75" />
      </svg>
      <span className="font-display font-semibold text-lg tracking-tight text-stone-900 dark:text-stone-50 group-hover:text-ember-600 dark:group-hover:text-ember-400 transition-colors duration-200">
        Neuron
      </span>
    </Link>
  );
}

function ThemeToggle({ isDark, toggle }) {
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-150 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      ) : (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function ProgressPill({ percent }) {
  if (percent === 0) return null;
  return (
    <Link
      to="/progress"
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-150 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-ember-50 dark:hover:bg-stone-700 hover:text-ember-700 dark:hover:text-ember-300 transition-colors duration-200 text-sm font-body"
      aria-label={`${percent}% complete — view progress`}
    >
      <div className="w-16 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-ember-600 dark:bg-ember-500 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums">{percent}%</span>
    </Link>
  );
}

export default function Nav() {
  const { theme, toggle, isDark } = useTheme();
  const { percent } = useProgress();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800'
          : 'bg-transparent'
      }`}
    >
      <div className="container-site h-16 flex items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-body font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-ember-700 dark:text-ember-400 bg-ember-50 dark:bg-ember-900/20'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ProgressPill percent={percent} />
          <ThemeToggle isDark={isDark} toggle={toggle} />

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-150 dark:hover:bg-stone-800 transition-colors duration-200"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              {menuOpen ? (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950"
          >
            <nav className="container-site py-3 flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-md text-base font-body font-medium transition-colors duration-150 ${
                      isActive
                        ? 'text-ember-700 dark:text-ember-400 bg-ember-50 dark:bg-ember-900/20'
                        : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              {percent > 0 && (
                <Link
                  to="/progress"
                  className="px-3 py-2.5 rounded-md text-base font-body font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-150"
                >
                  Progress — {percent}%
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
