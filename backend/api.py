from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import subprocess

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Debian AI Starter API")

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

class AIRequest(BaseModel):
    prompt: str

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "system": "Debian AI Starter"}

@app.post("/api/contact")
async def handle_contact(form: ContactForm):
    logger.info(f"Received contact form from {form.name} ({form.email})")
    # In a real app, send an email or save to a database here.
    return {"message": f"Thank you, {form.name}! We've received your message."}

@app.post("/api/run")
async def run_ai_task(request: AIRequest):
    logger.info(f"Triggering AI task with prompt: {request.prompt}")
    try:
        # Trigger the CLI tool and capture output
        # Using 'python3' and relative path to the cli/main.py script
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
