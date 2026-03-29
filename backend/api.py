from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import logging
import subprocess
import os

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Debian AI Starter API v2.5")

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths for Agents
AGENTS_DIR = os.path.abspath("agents")

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

class AIRequest(BaseModel):
    prompt: str

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "system": "Debian AI Starter", "version": "2.5"}

@app.post("/api/contact")
async def handle_contact(form: ContactForm):
    logger.info(f"Received contact form from {form.name} ({form.email})")
    # Simulation: send to database/email
    return {"message": f"Thank you, {form.name}! We've received your message."}

@app.post("/api/run")
async def run_ai_task(request: AIRequest):
    logger.info(f"Triggering AI task with prompt: {request.prompt}")
    try:
        # Trigger the CLI tool and capture output
        result = subprocess.run(
            ["python3", "cli/main.py", "ask", request.prompt],
            capture_output=True,
            text=True,
            check=True
        )
        return {"output": result.stdout.strip()}
    except subprocess.CalledProcessError as e:
        logger.error(f"AI Task failed: {e.stderr}")
        raise HTTPException(status_code=500, detail="AI processing failed.")

@app.get("/api/download/{agent_name}")
async def download_agent(agent_name: str):
    """
    Securely download an AI agent script from the agents/ directory.
    """
    # Prevent directory traversal attacks
    if ".." in agent_name or agent_name.startswith("/"):
        raise HTTPException(status_code=400, detail="Invalid agent name.")

    file_path = os.path.join(AGENTS_DIR, agent_name)

    if os.path.exists(file_path):
        logger.info(f"Serving agent: {agent_name}")
        return FileResponse(path=file_path, filename=agent_name, media_type='application/octet-stream')
    else:
        logger.error(f"Agent not found: {agent_name}")
        raise HTTPException(status_code=404, detail="Agent file not found.")

if __name__ == "__main__":
    import uvicorn
    # Start the FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000)
