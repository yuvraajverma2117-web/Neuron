import React, { useState, useEffect, useCallback } from 'react';

function generateChallenge() {
  const type = Math.floor(Math.random() * 4);
  switch (type) {
    case 0: {
      const a = Math.floor(Math.random() * 30) + 10;
      const b = Math.floor(Math.random() * 30) + 10;
      return { question: `${a} × ${b} = ?`, answer: a * b };
    }
    case 1: {
      const a = Math.floor(Math.random() * 50) + 50;
      const b = Math.floor(Math.random() * 50) + 50;
      return { question: `${a} + ${b} = ?`, answer: a + b };
    }
    case 2: {
      const a = (Math.floor(Math.random() * 9) + 1) * 5;
      const b = Math.floor(Math.random() * 20) + 10;
      return { question: `${a}% of ${b * 4} = ?`, answer: (a / 100) * (b * 4) };
    }
    case 3: {
      const start = 300 + Math.floor(Math.random() * 200);
      const step = Math.floor(Math.random() * 8) + 3;
      const n = Math.floor(Math.random() * 3) + 3;
      return {
        question: `Start at ${start}, subtract ${step} repeatedly.\nWhat is the ${n}th result?`,
        answer: start - step * n,
      };
    }
    default:
      return { question: '7 × 8 = ?', answer: 56 };
  }
}

export default function MathChallenge({ onSolved }) {
  const [challenge, setChallenge] = useState(generateChallenge);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => { setChallenge(generateChallenge()); }, []);

  const submit = useCallback(() => {
    if (parseInt(input, 10) === challenge.answer) {
      onSolved();
    } else {
      setShake(true);
      setError(true);
      setInput('');
      setTimeout(() => { setShake(false); setError(false); setChallenge(generateChallenge()); }, 800);
    }
  }, [input, challenge, onSolved]);

  const onKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div className={`flex flex-col items-center gap-4 ${shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}`}>
      <p className="text-lg font-semibold text-white text-center whitespace-pre-line">
        {challenge.question}
      </p>
      <input
        autoFocus
        type="number"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKey}
        className={`w-36 text-center text-2xl font-mono rounded-xl px-3 py-2 bg-white/10 border-2
          ${error ? 'border-red-500 text-red-300' : 'border-white/30 text-white'}
          focus:outline-none focus:border-blue-400`}
        placeholder="?"
      />
      <button
        onClick={submit}
        className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
      >
        Submit
      </button>
      <p className="text-xs text-white/40">Answer correctly to dismiss the alarm</p>
    </div>
  );
}
