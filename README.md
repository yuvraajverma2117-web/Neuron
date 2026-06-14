# Stay Awake

A browser-based drowsiness-detection app that actively snaps you back to alertness using forced physical or cognitive responses.

---

## How to run

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Grant webcam access when prompted. All video processing runs **locally in the browser** — nothing is uploaded.

---

## How EAR detection works

**Eye Aspect Ratio (EAR)** measures how open each eye is using 6 landmark points per eye from MediaPipe Face Mesh:

```
      P2    P3
P1 ───────────── P4
      P6    P5
```

```
EAR = (|P2−P6| + |P3−P5|) / (2 × |P1−P4|)
```

- When eyes are fully open, EAR ≈ 0.25–0.35.
- When eyes close, EAR drops toward 0.
- `EAR_THRESHOLD = 0.22` — below this for `EAR_CONSEC_FRAMES = 48` (~2 s at 30 fps) → drowsy.

Both eyes are averaged and smoothed over `EAR_SMOOTHING_FRAMES = 5` frames to reduce noise from blinking.

**Additional signals:**
- **MAR (Mouth Aspect Ratio)** — same formula applied to mouth landmarks; `MAR > 0.65` → yawn detected.
- **Head nod** — tracks the normalised Y-position of the nose tip; drops > `NOD_THRESHOLD = 0.08` below the session baseline trigger a nod flag.

---

## Intervention escalation

| Event count in 10-min window | Action |
|---|---|
| 1st | Gentle nudge: screen pulse + soft chime + movement/math challenge |
| 2nd | Loud flashing alarm (randomised pitch so brain can't habituate) + mandatory math challenge |
| 3rd+ | Stop pushing. Recommend: power nap / cold water / walk |

The 3-event limit prevents the app from bullying a genuinely exhausted user.

---

## Tunable constants

All thresholds live in `src/stayawake/constants.js`:

| Constant | Default | Meaning |
|---|---|---|
| `EAR_THRESHOLD` | `0.22` | Eye openness below which eyes are "closed" |
| `EAR_CONSEC_FRAMES` | `48` | Frames of low EAR before alerting (~2 s) |
| `EAR_SMOOTHING_FRAMES` | `5` | Rolling average window to reduce jitter |
| `MAR_THRESHOLD` | `0.65` | Mouth openness indicating a yawn |
| `NOD_THRESHOLD` | `0.08` | Nose-tip Y drop indicating head nod |
| `DROWSY_DELAY_MS` | `2000` | Grace period before triggering intervention |
| `ESCALATION_WINDOW_MINUTES` | `10` | Window for counting repeated events |
| `EXHAUSTION_EVENT_LIMIT` | `3` | Events in window before switching to rest recommendation |
| `POMODORO_WORK_MINUTES` | `25` | Pomodoro work phase length |

---

## Privacy

MediaPipe runs entirely client-side via WebAssembly. The webcam stream never leaves your device.
