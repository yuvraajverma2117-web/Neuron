import React from 'react';
import { Link } from 'react-router-dom';

function Principle({ number, title, body }) {
  return (
    <div className="flex gap-5 py-6 border-b border-stone-200 dark:border-stone-800 last:border-0">
      <span className="font-display text-5xl font-bold text-stone-150 dark:text-stone-800 leading-none flex-shrink-0 select-none w-12">
        {number}
      </span>
      <div>
        <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">{title}</h3>
        <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container-site py-16">

        <div className="max-w-2xl">

          <div className="mb-14">
            <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">Teaching philosophy</p>
            <h1 className="font-display text-5xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-6">
              The Method
            </h1>
            <p className="text-xl text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              There's a specific kind of learner this is built for: someone who can sit with a hard idea and
              work through it — but who has never written a line of code.
            </p>
            <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              Someone comfortable with school calculus. Someone who finds
              "just trust the math" deeply unsatisfying. Someone who wants to actually understand
              what they're building, not just get a model running.
            </p>
          </div>

          {/* Principles */}
          <div className="mb-14">
            <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
              Six principles
            </h2>
            <div>
              <Principle
                number="1"
                title="Intuition before formulas"
                body="Every concept is introduced with a physical analogy or concrete scenario before the equation appears. The goal is that the formula, when it arrives, feels inevitable — like the obvious way to write down what you already understand."
              />
              <Principle
                number="2"
                title="Math as a tool, not a gatekeeper"
                body="Since you know calculus, we use it — but only when an equation genuinely clarifies something that words can't. Never for signaling rigor. The derivative of the loss function appears because knowing it is how gradient descent works. Period."
              />
              <Principle
                number="3"
                title="Code at the right moment"
                body="Code appears after the concept is established, not as an introduction to it. By Stage 6, you already know what a gradient descent step does. Writing it in Python is satisfying, not confusing. Cause and effect in the right order."
              />
              <Principle
                number="4"
                title="One idea per stage"
                body="The curriculum is staged deliberately. Stage 1 is literally one idea. Stage 2 adds one thing: the weighted sum. Nothing is introduced before it's needed. The patience to resist overloading is the discipline that makes learning stick."
              />
              <Principle
                number="5"
                title="Primary sources"
                body="The curated videos — 3Blue1Brown, StatQuest, Karpathy — are not supplements to be watched 'if you want more.' They're primary material. They were made by people who care deeply about explanation, and no written description of gradient descent can match 3Blue1Brown's visualization of it."
              />
              <Principle
                number="6"
                title="No hype"
                body="Neural networks are genuinely remarkable, but nothing here will promise that learning them will change your life or unlock your potential. They're a fascinating class of algorithms. That's enough."
              />
            </div>
          </div>

          {/* How to use it */}
          <div className="mb-14 p-6 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              How to use this site
            </h2>
            <ol className="space-y-3">
              {[
                'Work through stages in order. The order is load-bearing.',
                'Read the intuition section before watching the video. It\'s priming material.',
                'Interact with the demos. Actually drag the dials. Actually watch the classifier train.',
                'Do the exercises on paper. Not in your head — on paper.',
                'Mark a stage complete only when you can answer the checkpoint from memory.',
                'When you reach Stage 6, write the code. Copy it first, then delete and rewrite from scratch.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-stone-600 dark:text-stone-400">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-ember-600 text-white text-xs font-mono flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Who it's not for */}
          <div className="mb-14">
            <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Who this is not for
            </h2>
            <ul className="space-y-2">
              {[
                'People who want to start coding immediately and figure out the theory later.',
                'Experienced ML practitioners looking for advanced techniques.',
                'People who want a certificate or proof of completion.',
                'People who want to learn "AI" without learning the math.',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-stone-600 dark:text-stone-400">
                  <span className="text-stone-300 dark:text-stone-700 font-mono flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Start CTA */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-3">
            <Link
              to="/stages/the-one-idea"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 font-body font-medium text-sm hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors duration-200"
            >
              Start with Stage 1
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h8M8 4l3 3-3 3" />
              </svg>
            </Link>
            <Link
              to="/path"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-body font-medium text-sm hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors duration-200"
            >
              See the full path
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
