# J.A.R.V.I.S HUD — CS50 / iPad Codespace Edition

A web-based version of the original PyGame macOS JARVIS HUD.
Runs entirely in the browser — no pygame, pyaudio, or macOS required.

## Features
- ⏰ Real-time clock
- 📅 Calendar with today highlighted
- ☀️ Time-based sun phase icon (sunrise/sun/sunset)
- 📝 To-do list from `.todo.txt`
- 🎵 Audio-reactive JARVIS ring (uses browser mic)
- 🤖 Pico GIF (draggable via mouse, touch, or hand gesture)
- ✋ Hand tracking via MediaPipe (optional, uses camera)
- 🎛️ All original assets supported

---

## Setup in CS50 VS Code (iPad / Browser)

### 1. Install Flask
```bash
pip install flask
```

### 2. Copy your assets into the `static/` folder
```bash
cp jarvis.gif picogram.gif ARk.jpeg discord.png record.png sunrise.png sun.png sunset.png static/
cp Orbitron-VariableFont_wght.ttf static/   # (optional – loaded from Google Fonts by default)
```

### 3. Create your to-do list
```bash
echo "Buy groceries" > .todo.txt
echo "Work on project" >> .todo.txt
echo "Read a book" >> .todo.txt
```

### 4. Run the app
```bash
flask run --host=0.0.0.0
```
Or:
```bash
python app.py
```

CS50 codespace will show a popup to open the forwarded port in your browser.
Click **"Open in Browser"** when prompted (usually port 5000).

---

## Controls

| Action | How |
|--------|-----|
| Enable microphone audio visualizer | Click **🎙 ENABLE MIC** button (bottom right) |
| Toggle hand tracking | Click **✋ HANDS OFF/ON** button |
| Drag Pico GIF | Click and drag with mouse or touch |
| Grab Pico with hand | Close hand over Pico area (requires camera) |

---

## Customizing Pico's Description
Edit `app.py` and change the `PICO_DESCRIPTION` list near the top.

## Troubleshooting

- **Camera / mic not working on iPad?** — iOS Safari requires HTTPS for camera/mic. 
  In CS50 codespace, use the forwarded HTTPS URL (not `http://localhost`).
- **GIFs not showing?** — Make sure all files are in the `static/` folder.
- **Hand tracking slow?** — MediaPipe loads from CDN; give it a moment on first load.
