import React from 'react';

const NAV = [
  { id: 'dashboard',  label: 'Dashboard' },
  { id: 'analytics',  label: 'Analytics' },
  { id: 'bookmarks',  label: 'Bookmarks' },
];

export default function Header({ view, setView, theme, toggleTheme, onUpload }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 font-bold text-lg shrink-0"
        >
          <span className="text-blue-600 dark:text-blue-400">∑</span>
          <span className="hidden sm:inline text-gray-900 dark:text-gray-100">IOQM Practice</span>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${view === id
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onUpload}
            title="Upload questions"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload
          </button>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
