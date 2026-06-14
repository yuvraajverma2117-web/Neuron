import React, { useState } from 'react';

export default function VideoEmbed({ embedId, title, creator, duration, note, url }) {
  const [loaded, setLoaded] = useState(false);

  if (!embedId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-4 p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 hover:border-ember-400 dark:hover:border-ember-600 hover:bg-ember-50 dark:hover:bg-ember-900/10 transition-colors duration-200 group"
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
          <svg className="text-stone-500 dark:text-stone-400 group-hover:text-ember-600 dark:group-hover:text-ember-400 transition-colors" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm3.5 10.5l-5 3A.5.5 0 018 13V7a.5.5 0 01.5-.5l5 3a.5.5 0 010 .86v.14z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-ember-700 dark:group-hover:text-ember-400 transition-colors mb-0.5">{title}</p>
          <p className="text-xs text-stone-500 dark:text-stone-500 mb-1">{creator} · {duration}</p>
          {note && <p className="text-xs text-stone-500 dark:text-stone-500 italic">{note}</p>}
          <span className="text-xs text-ember-600 dark:text-ember-400 font-mono mt-1 inline-block">Open playlist →</span>
        </div>
      </a>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
      <div className="relative" style={{ paddingTop: '56.25%' }}>
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-100 dark:bg-stone-900">
            <div className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-stone-400 dark:bg-stone-600 animate-pulse" />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-500">Loading video…</p>
          </div>
        )}
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${embedId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="px-4 py-3 border-t border-stone-200 dark:border-stone-800">
        <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{title}</p>
        <p className="text-xs text-stone-500 dark:text-stone-500 mt-0.5">{creator} · {duration}</p>
        {note && <p className="text-xs text-stone-500 dark:text-stone-500 italic mt-1">{note}</p>}
      </div>
    </div>
  );
}
