import { useState, useCallback } from 'react';

const KEY = 'stayawake_stats_v1';

function loadStats() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultStats();
    return { ...defaultStats(), ...JSON.parse(raw) };
  } catch {
    return defaultStats();
  }
}

function defaultStats() {
  return {
    totalFocusSeconds: 0,
    sessionsCompleted: 0,
    drowsyEvents: [],        // [{ts, level}]
    longestStreakSeconds: 0,
    dailyFocusSeconds: {},   // {YYYY-MM-DD: seconds}
    streakDays: 0,
    lastActiveDate: null,
  };
}

export function useStats() {
  const [stats, setStats] = useState(loadStats);

  const save = useCallback((updated) => {
    setStats(updated);
    localStorage.setItem(KEY, JSON.stringify(updated));
  }, []);

  const recordFocusSeconds = useCallback((secs) => {
    const today = new Date().toISOString().split('T')[0];
    setStats(prev => {
      const daily = { ...prev.dailyFocusSeconds };
      daily[today] = (daily[today] || 0) + secs;
      const updated = {
        ...prev,
        totalFocusSeconds: prev.totalFocusSeconds + secs,
        sessionsCompleted: prev.sessionsCompleted + 1,
        dailyFocusSeconds: daily,
        lastActiveDate: today,
      };
      save(updated);
      return updated;
    });
  }, [save]);

  const recordDrowsyEvent = useCallback((level) => {
    setStats(prev => {
      const events = [...prev.drowsyEvents, { ts: Date.now(), level }].slice(-200);
      const updated = { ...prev, drowsyEvents: events };
      save(updated);
      return updated;
    });
  }, [save]);

  const updateStreak = useCallback((streakSeconds) => {
    setStats(prev => {
      if (streakSeconds <= prev.longestStreakSeconds) return prev;
      const updated = { ...prev, longestStreakSeconds: streakSeconds };
      save(updated);
      return updated;
    });
  }, [save]);

  const clearStats = useCallback(() => {
    const fresh = defaultStats();
    save(fresh);
  }, [save]);

  return { stats, recordFocusSeconds, recordDrowsyEvent, updateStreak, clearStats };
}
