// ── Tunable thresholds ──────────────────────────────────────────────────────

// Eye Aspect Ratio: ratio of eye-opening height to width.
// Values below EAR_THRESHOLD indicate a closed / drooping eye.
export const EAR_THRESHOLD = 0.22;

// How many consecutive frames EAR must stay below threshold before we call it
// a "prolonged close" (at ~30 fps this ≈ 2 s).
export const EAR_CONSEC_FRAMES = 48;

// How many frames of EAR averaging to smooth jitter.
export const EAR_SMOOTHING_FRAMES = 5;

// Mouth Aspect Ratio — above this → yawn detected.
export const MAR_THRESHOLD = 0.65;

// Head nod: normalised Y-distance the nose tip must drop below its calibrated
// position before we flag a nod.
export const NOD_THRESHOLD = 0.08;

// How long (ms) to wait after the EAR first drops before upgrading to DROWSY.
export const DROWSY_DELAY_MS = 2000;

// ── Intervention escalation ──────────────────────────────────────────────────

// Minutes within which repeated drowsy events trigger escalation.
export const ESCALATION_WINDOW_MINUTES = 10;

// After this many events in the window, recommend rest instead of pushing.
export const EXHAUSTION_EVENT_LIMIT = 3;

// ── Session / Pomodoro ───────────────────────────────────────────────────────

export const POMODORO_WORK_MINUTES = 25;
export const POMODORO_SHORT_BREAK_MINUTES = 5;
export const POMODORO_LONG_BREAK_MINUTES = 15;
export const POMODOROS_BEFORE_LONG_BREAK = 4;

// Daily focus cap before the app suggests stopping (minutes).
export const DAILY_FOCUS_CAP_MINUTES = 240;

// ── MediaPipe face-mesh landmark indices ────────────────────────────────────

// Each eye uses 6 landmarks for EAR.
export const LEFT_EYE = [362, 385, 387, 263, 373, 380];
export const RIGHT_EYE = [33, 160, 158, 133, 153, 144];

// Mouth landmarks for MAR (yawn).
export const MOUTH_TOP = 13;
export const MOUTH_BOTTOM = 14;
export const MOUTH_LEFT = 61;
export const MOUTH_RIGHT = 291;

// Nose tip for head-pose nod detection.
export const NOSE_TIP = 1;
