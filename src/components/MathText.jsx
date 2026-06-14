import React, { useMemo } from 'react';
import katex from 'katex';

function renderKatex(latex, display) {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: display,
      output: 'html',
      strict: false,
      trust: false,
    });
  } catch {
    return `<span style="color:red">[LaTeX error]</span>`;
  }
}

function parseMathText(text) {
  if (!text) return [];
  const parts = [];
  let i = 0;
  let textStart = 0;

  while (i < text.length) {
    if (text[i] !== '$') { i++; continue; }

    if (i > textStart) {
      parts.push({ type: 'text', content: text.slice(textStart, i) });
    }

    if (text[i + 1] === '$') {
      // Display math $$...$$
      const end = text.indexOf('$$', i + 2);
      if (end !== -1) {
        parts.push({ type: 'display', content: text.slice(i + 2, end) });
        i = end + 2;
        textStart = i;
        continue;
      }
    }
    // Inline math $...$
    const end = text.indexOf('$', i + 1);
    if (end !== -1) {
      parts.push({ type: 'inline', content: text.slice(i + 1, end) });
      i = end + 1;
      textStart = i;
      continue;
    }
    // Unmatched $
    i++;
    textStart = i - 1;
  }

  if (textStart < text.length) {
    parts.push({ type: 'text', content: text.slice(textStart) });
  }
  return parts;
}

export default function MathText({ text, className = '' }) {
  const parts = useMemo(() => parseMathText(text), [text]);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.type === 'text') {
          return <span key={idx}>{part.content}</span>;
        }
        if (part.type === 'inline') {
          return (
            <span
              key={idx}
              dangerouslySetInnerHTML={{ __html: renderKatex(part.content, false) }}
            />
          );
        }
        return (
          <span
            key={idx}
            className="block overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderKatex(part.content, true) }}
          />
        );
      })}
    </span>
  );
}
