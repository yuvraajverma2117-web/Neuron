import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Nav from './components/layout/Nav.jsx';
import Footer from './components/layout/Footer.jsx';
import { useReducedMotion } from './hooks/useReducedMotion.js';

import Home from './pages/Home.jsx';
import ThePath from './pages/ThePath.jsx';
import StagePage from './pages/StagePage.jsx';
import Playground from './pages/Playground.jsx';
import Library from './pages/Library.jsx';
import Glossary from './pages/Glossary.jsx';
import Progress from './pages/Progress.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

function PageTransition({ children }) {
  const reduced = useReducedMotion();
  const location = useLocation();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-body transition-colors duration-200">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ember-600 focus:text-white focus:rounded-md focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Nav />

      <main id="main-content" className="flex-1">
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/path" element={<ThePath />} />
            <Route path="/stages/:slug" element={<StagePage />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/library" element={<Library />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
