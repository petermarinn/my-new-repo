# Debian AI Starter System v2.0

A fully functional, end-to-end local AI starter system for Debian Linux. This project integrates a modern web frontend, a FastAPI backend, and an Ollama-powered CLI tool.

## Features

- **Local AI (Ollama Integration):** Uses `mistral` (default) for fast local AI responses.
- **FastAPI Backend:** Acts as a bridge between the frontend and the AI CLI.
- **Interactive Web UI:** Modern landing page with a working contact form and AI-powered service cards.
- **Automated Setup:** Single-command installer for all system and Python dependencies.

## End-to-End Setup (Recommended)

To set up the entire project automatically, run the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

The script installs system dependencies, creates a virtual environment, installs Python packages, and pulls the `mistral` AI model.

---

## Running the System

### 1. Start the Backend API

```bash
source venv/bin/activate
python3 backend/api.py
```

The API will run at `http://localhost:8000`.

### 2. Access the Frontend

Open `frontend/index.html` in your web browser. The frontend is configured to communicate with the FastAPI backend.

- **Contact Form:** Sends data to the backend API.
- **Services:** Click any service card to trigger a local AI generation.

### 3. Use the CLI Tool

```bash
source venv/bin/activate
# Ask a general question
python3 cli/main.py ask "What is Debian?"

# Run an automated AI task
python3 cli/main.py run "Summarize my git logs"

# Help and command list
python3 cli/main.py --help
```

---

## Troubleshooting

- **Ollama not found:** Ensure `ollama` is running (`ollama serve`).
- **Backend Connection Error:** Check if the FastAPI server is running on port 8000.
- **Model not found:** Run `ollama pull mistral` manually if the setup script was interrupted.

## Project Structure

- `backend/`: FastAPI application code.
- `cli/`: Python-based AI CLI tool.
- `frontend/`: HTML, CSS, and JS files.
- `setup.sh`: Automated installation script for Debian systems.
- `requirements.txt`: Python package dependencies.

---

## License

This project is licensed under the MIT License.
