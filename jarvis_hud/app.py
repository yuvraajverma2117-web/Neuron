"""
J.A.R.V.I.S HUD - Flask Web Version
Adapted from macOS pygame version to run on CS50 VS Code / iPad codespaces.
Run with: flask run --host=0.0.0.0
"""

from flask import Flask, render_template, jsonify
import datetime
import calendar
import os

app = Flask(__name__)

# Path to your to-do file (create .todo.txt in the same folder)
TODO_FILE = os.path.join(os.path.dirname(__file__), '.todo.txt')

PICO_DESCRIPTION = [
    "MateoTechLab File: Project Pico",
    "Personality is stable, but can be customized",
    "Uses an ESP32 Wrover module",
    "Open-source and community-driven",
    "Supports various sensors and modules",
    "Ideal for personal projects and educational purposes",
]


def get_todo_tasks():
    if os.path.exists(TODO_FILE):
        with open(TODO_FILE, "r") as f:
            return [line.strip() for line in f if line.strip()]
    return ["Add tasks to .todo.txt"]


def get_calendar_data():
    now = datetime.datetime.now()
    cal = calendar.monthcalendar(now.year, now.month)
    return {
        "month": now.strftime("%B %Y"),
        "weeks": cal,
        "today": now.day,
        "weekdays": ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    }


def get_sun_phase():
    hour = datetime.datetime.now().hour
    if 5 <= hour < 11:
        return "sunrise"
    elif 11 <= hour < 17:
        return "sun"
    else:
        return "sunset"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/data")
def api_data():
    now = datetime.datetime.now()
    return jsonify(
        {
            "time": now.strftime("%I:%M:%S %p"),
            "calendar": get_calendar_data(),
            "todo": get_todo_tasks(),
            "sun_phase": get_sun_phase(),
            "pico_description": PICO_DESCRIPTION,
        }
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
