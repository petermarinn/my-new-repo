import click
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

# Configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "mistral") # Default model

def check_ollama_status():
    """Checks if the local Ollama service is reachable."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=1)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False

def get_ai_response(prompt: str, model: str = DEFAULT_MODEL):
    """
    Core AI logic: try Ollama first, then fallback or fail.
    """
    if not check_ollama_status():
        return f"Error: Local Ollama service is not running. Please start it to use AI features."

    # Send request to local Ollama API
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=30)
        response.raise_for_status()
        return response.json().get("response", "No response from AI.")
    except Exception as e:
        return f"Error connecting to Ollama: {str(e)}"

@click.group()
def cli():
    """AI Starter CLI - Local AI on Debian."""
    pass

@cli.command()
@click.argument('prompt')
@click.option('--model', default=DEFAULT_MODEL, help='Specific model to use')
def ask(prompt, model):
    """Query the local AI model (Ollama)."""
    click.echo(f"AI Thinking (Model: {model})...")
    response = get_ai_response(prompt, model)
    click.echo(f"\nAI Response:\n{response}")

@cli.command()
@click.argument('task')
def run(task):
    """Execute an automated AI task."""
    # Simplified version for now
    click.echo(f"Running task: {task}...")
    # Map high-level tasks to specific prompts
    task_prompt = f"Perform the following task: {task}. Return only the result."
    response = get_ai_response(task_prompt)
    click.echo(f"Task Result: {response}")

@cli.command()
def version():
    """Show the version of the tool."""
    click.echo("Debian AI CLI version 2.0.0 (Ollama Powered)")

if __name__ == '__main__':
    cli()
