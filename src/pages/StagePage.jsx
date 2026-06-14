import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStageBySlug, getAdjacentStages } from '../data/stages.js';
import { useProgress } from '../hooks/useProgress.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import Breadcrumb from '../components/layout/Breadcrumb.jsx';
import VideoEmbed from '../components/ui/VideoEmbed.jsx';
import StageCheckpoint from '../components/ui/StageCheckpoint.jsx';
import ExerciseCard from '../components/ui/ExerciseCard.jsx';
import DialMachine from '../components/demos/DialMachine.jsx';
import ErrorBowl from '../components/demos/ErrorBowl.jsx';
import LiveClassifier from '../components/demos/LiveClassifier.jsx';

const DEMO_MAP = {
  dial: DialMachine,
  bowl: ErrorBowl,
  classifier: LiveClassifier,
};

function StageIntuition({ text }) {
  // Split on **bold** and render
  const parts = text.trim().split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        // Handle inline code
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((cp, j) => {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            return <code key={`${i}-${j}`} className="bg-stone-150 dark:bg-stone-800 text-ember-700 dark:text-ember-300 px-1.5 py-0.5 rounded text-sm font-mono">{cp.slice(1, -1)}</code>;
          }
          return cp;
        });
      })}
    </>
  );
}

function parseIntuitionParagraphs(text) {
  const paragraphs = text.trim().split(/\n\n+/);
  return paragraphs.filter(p => p.trim());
}

function RichParagraph({ text }) {
  // Detect code blocks
  if (text.trim().startsWith('```')) {
    const lines = text.trim().split('\n');
    const lang = lines[0].replace('```', '').trim() || 'code';
    const code = lines.slice(1, -1).join('\n');
    return (
      <div className="relative rounded-lg overflow-hidden border border-stone-800 bg-stone-950 my-5">
        <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800">
          <span className="text-xs font-mono text-stone-500 uppercase tracking-widest">{lang}</span>
        </div>
        <pre className="overflow-x-auto p-5 text-sm text-stone-200 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  // Detect **headings** at paragraph start
  if (text.trim().startsWith('**') && text.includes(':**')) {
    const colonIdx = text.indexOf(':**');
    const heading = text.slice(2, colonIdx);
    const rest = text.slice(colonIdx + 3).trim();
    return (
      <div className="mb-4">
        <h4 className="font-display font-semibold text-stone-900 dark:text-stone-100 text-lg mb-2">{heading}</h4>
        {rest && <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed"><StageIntuition text={rest} /></p>}
      </div>
    );
  }

  return (
    <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
      <StageIntuition text={text} />
    </p>
  );
}

export default function StagePage() {
  const { slug } = useParams();
  const stage = getStageBySlug(slug);
  const reduced = useReducedMotion();

  const { isCompleted, toggleStage } = useProgress();

  if (!stage) return <Navigate to="/404" replace />;

  const { prev, next } = getAdjacentStages(stage.id);
  const DemoComponent = stage.demoId ? DEMO_MAP[stage.demoId] : null;
  const completed = isCompleted(stage.id);

  const intuitionParas = parseIntuitionParagraphs(stage.intuition);
  const whyParas = stage.whyItMatters ? parseIntuitionParagraphs(stage.whyItMatters) : [];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container-site py-10">

        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'The Path', href: '/path' },
          { label: `Stage ${stage.id}` },
          { label: stage.title },
        ]} />

        {/* Stage header */}
        <div className="relative mb-14">
          {/* Background number */}
          <div
            className="stage-bg-num absolute right-0 top-0 text-stone-100 dark:text-stone-900 select-none pointer-events-none"
            aria-hidden="true"
          >
            {stage.id}
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ember-600 text-white text-sm font-mono font-semibold">
                {stage.id}
              </span>
              <span className="text-sm font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest">Stage</span>
              {completed && (
                <span className="text-xs font-mono text-sage-600 dark:text-sage-500 bg-sage-100 dark:bg-sage-700/20 px-2.5 py-1 rounded-full">
                  Complete
                </span>
              )}
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-3">
              {stage.title}
            </h1>
            <p className="text-xl text-stone-600 dark:text-stone-400 mb-2">{stage.subtitle}</p>
            <p className="text-sm font-mono text-stone-400 dark:text-stone-600">
              ~{stage.estimatedMinutes} minutes
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
          {/* Main column */}
          <div className="max-w-prose">

            {/* Goal */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                <span className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest">Goal</span>
                <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
              </div>
              <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed font-body italic">
                {stage.goal}
              </p>
            </section>

            {/* Intuition */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-5">
                The intuition
              </h2>
              <div className="prose-neuron">
                {intuitionParas.map((para, i) => (
                  <RichParagraph key={i} text={para} />
                ))}
              </div>
            </section>

            {/* Demo */}
            {DemoComponent && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-ember-600 dark:bg-ember-400 animate-pulse" />
                  <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
                    Try it
                  </h2>
                </div>
                <DemoComponent />
              </section>
            )}

            {/* Videos */}
            {stage.videos && stage.videos.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-5">
                  {stage.videos.length === 1 ? 'Watch' : 'Watch these'}
                </h2>
                <div className="space-y-5">
                  {stage.videos.map((video, i) => (
                    <VideoEmbed key={i} {...video} />
                  ))}
                </div>
              </section>
            )}

            {/* Why it matters */}
            {whyParas.length > 0 && (
              <section className="mb-10 p-5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3">
                  Why this matters
                </h2>
                <div className="prose-neuron">
                  {whyParas.map((para, i) => (
                    <RichParagraph key={i} text={para} />
                  ))}
                </div>
              </section>
            )}

            {/* Exercises */}
            {stage.exercises && stage.exercises.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-5">
                  Exercises
                </h2>
                <div className="space-y-3">
                  {stage.exercises.map((exercise, i) => (
                    <ExerciseCard key={exercise.id} number={i + 1} exercise={exercise} />
                  ))}
                </div>
              </section>
            )}

            {/* Checkpoint */}
            <StageCheckpoint
              stageId={stage.id}
              text={stage.checkpoint}
              completed={completed}
              onToggle={toggleStage}
            />

            {/* Prev/Next */}
            <nav className="mt-10 pt-8 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4" aria-label="Stage navigation">
              {prev ? (
                <Link
                  to={`/stages/${prev.slug}`}
                  className="group flex items-center gap-2 text-sm font-body text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-150"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 4L6 8l4 4" />
                  </svg>
                  <span>
                    <span className="text-xs font-mono text-stone-400 dark:text-stone-600 block">Previous</span>
                    {prev.title}
                  </span>
                </Link>
              ) : <div />}

              {next ? (
                <Link
                  to={`/stages/${next.slug}`}
                  className="group flex items-center gap-2 text-sm font-body text-stone-600 dark:text-stone-400 hover:text-ember-700 dark:hover:text-ember-400 transition-colors duration-150 text-right"
                >
                  <span>
                    <span className="text-xs font-mono text-stone-400 dark:text-stone-600 block text-right">Next</span>
                    {next.title}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4l4 4-4 4" />
                  </svg>
                </Link>
              ) : (
                <Link
                  to="/progress"
                  className="flex items-center gap-2 text-sm font-body font-medium text-ember-700 dark:text-ember-400 hover:underline underline-offset-2"
                >
                  View progress
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4l4 4-4 4" />
                  </svg>
                </Link>
              )}
            </nav>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              {/* Key terms */}
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-5">
                <h3 className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">Key terms</h3>
                <div className="flex flex-wrap gap-1.5">
                  {stage.keyTerms.map(term => (
                    <Link
                      key={term}
                      to={`/glossary#${term.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-xs font-mono text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-ember-100 dark:hover:bg-ember-900/20 hover:text-ember-700 dark:hover:text-ember-400 px-2 py-1 rounded transition-colors duration-150"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stage progress */}
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-5">
                <h3 className="text-xs font-mono text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">All stages</h3>
                <div className="space-y-1">
                  {Array.from({ length: 8 }, (_, i) => i + 1).map(id => (
                    <div
                      key={id}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors duration-150 ${
                        id === stage.id ? 'bg-ember-50 dark:bg-ember-900/20' : ''
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isCompleted(id)
                          ? 'bg-ember-600 border-ember-600'
                          : id === stage.id
                          ? 'border-ember-600 dark:border-ember-400'
                          : 'border-stone-300 dark:border-stone-700'
                      }`}>
                        {isCompleted(id) && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="2">
                            <path d="M1.5 4l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs font-body ${
                        id === stage.id
                          ? 'text-ember-700 dark:text-ember-400 font-medium'
                          : 'text-stone-500 dark:text-stone-500'
                      }`}>
                        {id}. {[
                          'The One Idea', 'A Single Neuron', 'Gradient Descent',
                          "Why One Isn't Enough", 'Backpropagation', 'Make It Real',
                          'Teaching It to See', 'Capstone'
                        ][id - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
