#!/usr/bin/env python3
import sys
import requests
import json

def generate_code(task: str):
    """
    Simulated Code Agent:
    Specializes in Python-based code generation and analysis on Debian.
    """
    print(f"Generating code for: {task}...")

    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "mistral",
        "prompt": f"Write efficient Python code for the following task, optimized for a Debian environment: {task}. Include comments and a simple test.",
        "stream": False
    }

    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json().get("response", "No code generated.")
        print("\n--- Generated Code ---\n")
        print(result)
    except Exception as e:
        print(f"Error: Could not connect to Ollama. Make sure it's running locally. ({e})")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 code_agent.py \"Your Coding Task\"")
    else:
        generate_code(" ".join(sys.argv[1:]))
