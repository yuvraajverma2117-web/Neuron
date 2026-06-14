import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DialMachine from '../components/demos/DialMachine.jsx';
import ErrorBowl from '../components/demos/ErrorBowl.jsx';
import LiveClassifier from '../components/demos/LiveClassifier.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const DEMOS = [
  {
    id: 'dial',
    name: 'Dial Machine',
    stage: 'Stage 1',
    description: 'The one-weight, one-input neuron. Drag the dial to match a target output. Feel the guess-and-adjust loop.',
    Component: DialMachine,
  },
  {
    id: 'bowl',
    name: 'Error Bowl',
    stage: 'Stage 3',
    description: 'The loss as a parabola. The ball rolls downhill via gradient descent. Adjust the learning rate and watch what happens.',
    Component: ErrorBowl,
  },
  {
    id: 'classifier',
    name: 'Live Classifier',
    stage: 'Stage 4',
    description: 'A two-layer network learns to separate inner from outer dots in real time. The colored regions are the decision boundary.',
    Component: LiveClassifier,
  },
];

export default function Playground() {
  const [active, setActive] = useState('dial');
  const reduced = useReducedMotion();

  const current = DEMOS.find(d => d.id === active);
  const ActiveComponent = current.Component;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container-site py-16">

        <div className="mb-10">
          <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">Free play</p>
          <h1 className="font-display text-5xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-4">
            Playground
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-prose">
            All three interactive demos, unattached from the stage context.
            Poke around. Try extreme values. Break things.
          </p>
        </div>

        {/* Demo switcher */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DEMOS.map(demo => (
            <button
              key={demo.id}
              onClick={() => setActive(demo.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border font-body text-sm font-medium transition-all duration-150 ${
                active === demo.id
                  ? 'border-ember-600 bg-ember-600 text-white'
                  : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                active === demo.id
                  ? 'bg-white/20 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-500'
              }`}>
                {demo.stage}
              </span>
              {demo.name}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="mb-6 p-4 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{current.description}</p>
        </div>

        {/* Demo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>

        {/* Context links */}
        <div className="mt-10 pt-8 border-t border-stone-200 dark:border-stone-800">
          <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">See this demo in context</p>
          <div className="flex flex-wrap gap-3">
            {DEMOS.map(demo => (
              <a
                key={demo.id}
                href={`/stages/${
                  demo.id === 'dial' ? 'the-one-idea'
                  : demo.id === 'bowl' ? 'gradient-descent'
                  : 'beyond-one-neuron'
                }#demo`}
                className="text-sm font-body text-ember-600 dark:text-ember-400 hover:underline underline-offset-2"
              >
                {demo.name} in {demo.stage} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
