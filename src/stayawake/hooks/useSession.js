import { useState, useRef, useCallback, useEffect } from 'react';
import {
  POMODORO_WORK_MINUTES, POMODORO_SHORT_BREAK_MINUTES,
  POMODORO_LONG_BREAK_MINUTES, POMODOROS_BEFORE_LONG_BREAK,
} from '../constants';

const PHASES = { WORK: 'WORK', SHORT_BREAK: 'SHORT_BREAK', LONG_BREAK: 'LONG_BREAK', IDLE: 'IDLE' };

export function useSession(onSessionComplete) {
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_WORK_MINUTES * 60);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [task, setTask] = useState('');
  const [taskDone, setTaskDone] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(0);

  const intervalRef = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const clearTimer = () => { clearInterval(intervalRef.current); intervalRef.current = null; };

  const startPhase = useCallback((ph, secs) => {
    clearTimer();
    setPhase(ph);
    setSecondsLeft(secs);
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearTimer();
          // auto-advance
          if (ph === PHASES.WORK) {
            setPomodoroCount(c => {
              const next = c + 1;
              const isLong = next % POMODOROS_BEFORE_LONG_BREAK === 0;
              startPhase(
                isLong ? PHASES.LONG_BREAK : PHASES.SHORT_BREAK,
                (isLong ? POMODORO_LONG_BREAK_MINUTES : POMODORO_SHORT_BREAK_MINUTES) * 60
              );
              onSessionComplete?.({ focusSeconds: POMODORO_WORK_MINUTES * 60 });
              return next;
            });
          } else {
            startPhase(PHASES.WORK, POMODORO_WORK_MINUTES * 60);
          }
          return 0;
        }
        if (ph === PHASES.WORK) setFocusSeconds(f => f + 1);
        return s - 1;
      });
    }, 1000);
  }, []); // eslint-disable-line

  const startWork = useCallback(() => {
    setTaskDone(false);
    startPhase(PHASES.WORK, POMODORO_WORK_MINUTES * 60);
  }, [startPhase]);

  const pause = useCallback(() => clearTimer(), []);

  const resume = useCallback(() => {
    if (phaseRef.current === PHASES.IDLE) return;
    setSecondsLeft(s => {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) { clearTimer(); return 0; }
          if (phaseRef.current === PHASES.WORK) setFocusSeconds(f => f + 1);
          return prev - 1;
        });
      }, 1000);
      return s;
    });
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setPhase(PHASES.IDLE);
    setSecondsLeft(POMODORO_WORK_MINUTES * 60);
  }, []);

  useEffect(() => () => clearTimer(), []);

  const isRunning = intervalRef.current !== null;

  return {
    phase, secondsLeft, pomodoroCount, task, setTask,
    taskDone, setTaskDone, focusSeconds, isRunning,
    startWork, pause, resume, stop, PHASES,
  };
}
