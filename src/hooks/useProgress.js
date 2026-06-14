import { useState, useCallback, useEffect } from 'react';
import { STAGES } from '../data/stages.js';

const STORAGE_KEY = 'neuron_progress';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useProgress() {
  const [completed, setCompleted] = useState(load);

  useEffect(() => {
    save(completed);
  }, [completed]);

  const toggleStage = useCallback((stageId) => {
    setCompleted(prev => {
      const next = { ...prev };
      if (next[stageId]) {
        delete next[stageId];
      } else {
        next[stageId] = { completedAt: Date.now() };
      }
      return next;
    });
  }, []);

  const isCompleted = useCallback((stageId) => {
    return Boolean(completed[stageId]);
  }, [completed]);

  const reset = useCallback(() => {
    setCompleted({});
  }, []);

  const completedCount = Object.keys(completed).length;
  const totalCount = STAGES.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  const nextStage = STAGES.find(s => !completed[s.id]) || null;

  return { completed, isCompleted, toggleStage, reset, completedCount, totalCount, percent, nextStage };
}
