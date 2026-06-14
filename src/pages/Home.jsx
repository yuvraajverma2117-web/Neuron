import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { STAGES } from '../data/stages.js';
import { useProgress } from '../hooks/useProgress.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import DialMachine from '../components/demos/DialMachine.jsx';

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StatItem({ num, label }) {
  return (
    <div>
      <p className="font-display text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">{num}</p>
      <p className="text-sm text-stone-500 dark:text-stone-500 font-body mt-0.5">{label}</p>
    </div>
  );
}

function PathPreview({ stages, isCompleted }) {
  return (
    <div className="space-y-1.5">
      {stages.map((stage, i) => (
        <Link
          key={stage.id}
          to={`/stages/${stage.slug}`}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-150"
        >
          <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${
            isCompleted(stage.id)
              ? 'bg-ember-600 border-ember-600'
              : 'border-stone-300 dark:border-stone-700 group-hover:border-ember-400'
          }`}>
            {isCompleted(stage.id) && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                <path d="M2 5l2.5 2.5L8 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-sm font-mono text-stone-500 dark:text-stone-500 w-4 flex-shrink-0">{i + 1}</span>
          <span className="text-sm font-body text-stone-800 dark:text-stone-200 group-hover:text-ember-700 dark:group-hover:text-ember-400 transition-colors duration-150">
            {stage.title}
          </span>
          <span className="ml-auto text-xs font-mono text-stone-400 dark:text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {stage.estimatedMinutes}m →
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  const { isCompleted, percent, nextStage } = useProgress();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container-site pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">

          {/* Left: editorial text */}
          <div>
            {/* Stage callout */}
            <FadeUp>
              <div className="inline-flex items-center gap-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-600 dark:bg-ember-400" />
                <span className="text-xs font-mono text-stone-500 dark:text-stone-500 uppercase tracking-widest">
                  8 stages · self-paced · free
                </span>
              </div>
            </FadeUp>

            {/* Large chapter number — editorial background element */}
            <FadeUp delay={0.05}>
              <div className="relative">
                <div
                  className="stage-bg-num absolute -left-2 -top-10 text-stone-100 dark:text-stone-900 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  N
                </div>
                <div className="relative">
                  <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 dark:text-stone-50 tracking-tight leading-none mb-6 text-balance">
                    From zero<br />to a network<br />
                    <em className="font-light not-italic text-ember-600 dark:text-ember-400">that sees.</em>
                  </h1>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 max-w-prose leading-relaxed">
                A self-paced path through neural networks — from the first gut-level idea to training an image classifier.
                Intuition first. Math second. Code third.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="text-sm text-stone-500 dark:text-stone-500 mb-10 max-w-[50ch] leading-relaxed">
                You're sharp at math but haven't coded before. This isn't a course,
                a bootcamp, or a sales funnel. It's a mentor in written form.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={nextStage ? `/stages/${nextStage.slug}` : '/stages/the-one-idea'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 font-body font-medium text-sm hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors duration-200"
                >
                  {percent > 0 ? `Continue — Stage ${nextStage?.id}` : 'Start with Stage 1'}
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
            </FadeUp>

            {/* Stats */}
            <FadeUp delay={0.25}>
              <div className="mt-14 pt-10 border-t border-stone-200 dark:border-stone-800 grid grid-cols-3 gap-6">
                <StatItem num="8" label="stages" />
                <StatItem num="~8h" label="total time" />
                <StatItem num="3" label="live demos" />
              </div>
            </FadeUp>
          </div>

          {/* Right: live demo preview */}
          <FadeUp delay={0.3}>
            <div className="lg:sticky lg:top-24">
              <div className="mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-600 animate-pulse" />
                <span className="text-xs font-mono text-stone-500 dark:text-stone-500">Interactive demo — try it</span>
              </div>
              <DialMachine />
              <p className="mt-3 text-xs text-stone-400 dark:text-stone-600 text-center font-body">
                This is Stage 1's demo. Every stage has one.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Philosophy strip ─────────────────────────────────────────────── */}
      <section className="border-y border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
        <div className="container-site py-14">
          <FadeUp>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div>
                <p className="text-xs font-mono text-ember-600 dark:text-ember-400 uppercase tracking-widest mb-3">Principle 01</p>
                <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Intuition first</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Every idea is introduced with a physical analogy before the equation.
                  You'll feel it before you can prove it.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono text-ember-600 dark:text-ember-400 uppercase tracking-widest mb-3">Principle 02</p>
                <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Math when it clarifies</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  You can handle calculus — so when an equation makes something
                  clearer than words, we use it. Never for decoration.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono text-ember-600 dark:text-ember-400 uppercase tracking-widest mb-3">Principle 03</p>
                <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Code that you understand</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  By the time you write code, you already know what each line does.
                  No black boxes, no copy-pasting without understanding.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Path overview ─────────────────────────────────────────────────── */}
      <section className="container-site py-20">
        <FadeUp>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-2">The curriculum</p>
              <h2 className="font-display text-3xl font-semibold text-stone-900 dark:text-stone-100">Eight stages.</h2>
            </div>
            <Link
              to="/path"
              className="text-sm font-body text-ember-600 dark:text-ember-400 hover:underline underline-offset-2"
            >
              View full roadmap →
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="grid md:grid-cols-2 gap-x-8">
            <PathPreview stages={STAGES.slice(0, 4)} isCompleted={isCompleted} />
            <PathPreview stages={STAGES.slice(4)} isCompleted={isCompleted} />
          </div>
        </FadeUp>

        {percent > 0 && (
          <FadeUp delay={0.15}>
            <div className="mt-8 p-4 rounded-lg bg-ember-50 dark:bg-ember-900/10 border border-ember-100 dark:border-ember-900 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-ember-600 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-sm font-body text-stone-700 dark:text-stone-300">
                  {percent}% complete
                </span>
              </div>
              {nextStage && (
                <Link
                  to={`/stages/${nextStage.slug}`}
                  className="text-sm font-body font-medium text-ember-700 dark:text-ember-400 hover:underline underline-offset-2"
                >
                  Continue: {nextStage.title} →
                </Link>
              )}
            </div>
          </FadeUp>
        )}
      </section>

      {/* ── Curator note ─────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200 dark:border-stone-800">
        <div className="container-site py-16">
          <FadeUp>
            <div className="max-w-2xl">
              <p className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-4">A note on the videos</p>
              <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                The curated videos here — 3Blue1Brown, StatQuest, Andrej Karpathy — are genuinely
                the best free resources on neural networks in existence. They're embedded here
                not as filler, but because each one was chosen to do specific work at a specific moment.
              </p>
              <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                The written intuition on each stage page primes you for the video.
                The exercises after the video cement it. That order is intentional.
              </p>
              <Link
                to="/library"
                className="inline-flex items-center gap-2 mt-5 text-sm font-body text-ember-600 dark:text-ember-400 hover:underline underline-offset-2"
              >
                Browse the full library
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h8M8 4l3 3-3 3" />
                </svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
