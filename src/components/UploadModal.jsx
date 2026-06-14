import React, { useState, useRef } from 'react';

const EXAMPLE_JSON = JSON.stringify([
  {
    id: 'custom_001',
    year: 2024,
    topic: 'Algebra',
    difficulty: 'medium',
    answer_type: 'integer',
    question_text: 'If $x^2 - 3x + 2 = 0$, find $x^2 + \\frac{1}{x^2}$ for the larger root.',
    options: null,
    correct_answer: '5',
    solution: 'Roots are $x=1$ and $x=2$. For $x=2$: $4 + 1/4 = 17/4$... (adjust as needed)',
  },
], null, 2);

function parseCsv(text) {
  const lines = text.trim().split('\n');
  if (!lines.length) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.match(/(".*?"|[^,]+)/g) || [];
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (vals[i] || '').replace(/^"|"$/g, '').trim();
    });
    return obj;
  });
}

function validateQuestion(q) {
  const errors = [];
  if (!q.id) errors.push('missing id');
  if (!q.question_text) errors.push('missing question_text');
  if (!q.correct_answer) errors.push('missing correct_answer');
  if (!['mcq', 'integer'].includes(q.answer_type)) errors.push('answer_type must be "mcq" or "integer"');
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) errors.push('difficulty must be easy/medium/hard');
  const y = Number(q.year);
  if (isNaN(y) || y < 2000 || y > 2100) errors.push('invalid year');
  return errors;
}

export default function UploadModal({ onUpload, onClose }) {
  const [tab, setTab]           = useState('file');  // 'file' | 'json' | 'help'
  const [jsonText, setJsonText] = useState('');
  const [preview, setPreview]   = useState(null);
  const [error, setError]       = useState('');
  const fileRef = useRef(null);

  const processData = (data) => {
    if (!Array.isArray(data)) {
      setError('Data must be a JSON array of questions.');
      return;
    }
    const results = data.map(q => {
      const errs = validateQuestion(q);
      return { q, errs };
    });
    const valid   = results.filter(r => !r.errs.length).map(r => ({ ...r.q, year: Number(r.q.year) }));
    const invalid = results.filter(r => r.errs.length);
    setPreview({ valid, invalid });
    setError('');
  };

  const handleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const text = ev.target.result;
        if (file.name.endsWith('.csv')) {
          const rows = parseCsv(text);
          processData(rows);
        } else {
          processData(JSON.parse(text));
        }
      } catch {
        setError('Failed to parse file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleJsonPaste = () => {
    try {
      processData(JSON.parse(jsonText));
    } catch {
      setError('Invalid JSON. Please check syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Upload Questions</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          {[['file','File Upload'],['json','Paste JSON'],['help','Schema Help']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => { setTab(id); setError(''); setPreview(null); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {tab === 'file' && (
            <div className="space-y-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <div className="text-4xl mb-3">📂</div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Click to upload a file</p>
                <p className="text-sm text-gray-500 mt-1">Supports <code>.json</code> and <code>.csv</code></p>
                <input ref={fileRef} type="file" accept=".json,.csv" onChange={handleFile} className="hidden" />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>}
            </div>
          )}

          {tab === 'json' && (
            <div className="space-y-4">
              <textarea
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                placeholder={`Paste your JSON array here…\n\nExample:\n${EXAMPLE_JSON}`}
                rows={12}
                className="w-full px-4 py-3 text-xs font-mono rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:outline-none resize-none"
              />
              {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>}
              <button
                onClick={handleJsonPaste}
                disabled={!jsonText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium"
              >
                Parse JSON
              </button>
            </div>
          )}

          {tab === 'help' && (
            <div className="space-y-4 text-sm">
              <p className="text-gray-600 dark:text-gray-400">Upload a <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.json</code> file containing an array of question objects, or a CSV with matching column headers.</p>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Question Schema</h3>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="text-left p-2 rounded-tl-lg">Field</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2 rounded-tr-lg">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-400">
                    {[
                      ['id', 'string', 'Unique identifier, e.g. "my_q001"'],
                      ['year', 'number', '2021–2024'],
                      ['topic', 'string', 'Algebra / Number Theory / Geometry / Combinatorics'],
                      ['difficulty', 'string', '"easy" | "medium" | "hard"'],
                      ['answer_type', 'string', '"integer" | "mcq"'],
                      ['question_text', 'string', 'LaTeX supported using $…$ and $$…$$'],
                      ['correct_answer', 'string', 'Exact answer text (or MCQ option text)'],
                      ['options', 'array|null', 'Array of option strings for MCQ, null otherwise'],
                      ['solution', 'string', 'Full solution, LaTeX supported'],
                    ].map(([f, t, n]) => (
                      <tr key={f} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="p-2 font-mono font-medium text-blue-600 dark:text-blue-400">{f}</td>
                        <td className="p-2">{t}</td>
                        <td className="p-2">{n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <pre className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-xs overflow-x-auto font-mono">{EXAMPLE_JSON}</pre>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="mt-5 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-green-600 dark:text-green-400 font-semibold">{preview.valid.length} valid</span>
                {preview.invalid.length > 0 && (
                  <span className="text-red-600 dark:text-red-400 font-semibold">{preview.invalid.length} invalid</span>
                )}
              </div>
              {preview.invalid.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-xs text-red-700 dark:text-red-300 space-y-1 max-h-32 overflow-y-auto">
                  {preview.invalid.map(({ q, errs }, i) => (
                    <div key={i}>• {q.id || `row ${i + 1}`}: {errs.join(', ')}</div>
                  ))}
                </div>
              )}
              {preview.valid.length > 0 && (
                <button
                  onClick={() => onUpload(preview.valid)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Import {preview.valid.length} Question{preview.valid.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
