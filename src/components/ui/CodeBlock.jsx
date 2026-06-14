import React, { useState } from 'react';

export default function CodeBlock({ code, language = 'python' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-stone-800 bg-stone-950 my-5">
      <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800">
        <span className="text-xs font-mono text-stone-500 uppercase tracking-widest">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs font-mono text-stone-500 hover:text-stone-200 transition-colors duration-150 flex items-center gap-1.5"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="7" height="7" rx="1" />
                <path d="M8 4V2a1 1 0 00-1-1H2a1 1 0 00-1 1v5a1 1 0 001 1h2" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-sm text-stone-200 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
