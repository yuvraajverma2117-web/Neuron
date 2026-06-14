import { useState, useRef, useCallback } from 'react';
import { ESCALATION_WINDOW_MINUTES, EXHAUSTION_EVENT_LIMIT } from '../constants';

// Levels: null | 'gentle' | 'loud' | 'rest'
export function useDrowsiness() {
  const [interventionLevel, setInterventionLevel] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const eventTimestamps = useRef([]);

  const triggerDrowsy = useCallback(() => {
    const now = Date.now();
    const windowMs = ESCALATION_WINDOW_MINUTES * 60 * 1000;
    // prune old events
    eventTimestamps.current = eventTimestamps.current.filter(t => now - t < windowMs);
    eventTimestamps.current.push(now);

    const count = eventTimestamps.current.length;

    if (count >= EXHAUSTION_EVENT_LIMIT) {
      setInterventionLevel('rest');
    } else if (count === 2) {
      setInterventionLevel('loud');
    } else {
      setInterventionLevel('gentle');
    }
    setDismissed(false);
  }, []);

  const dismiss = useCallback(() => {
    setInterventionLevel(null);
    setDismissed(true);
  }, []);

  const reset = useCallback(() => {
    eventTimestamps.current = [];
    setInterventionLevel(null);
    setDismissed(false);
  }, []);

  const eventCount = eventTimestamps.current.length;

  return { interventionLevel, dismissed, triggerDrowsy, dismiss, reset, eventCount };
}
