#!/usr/bin/env python3
import sys
import requests
import json

def run_research(query: str):
    """
    Simulated Research Agent:
    Connects to local Ollama (mistral) to perform deep research on a topic.
    """
    print(f"Researching: {query}...")

    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "mistral",
        "prompt": f"Perform a detailed research on the following topic and summarize the key findings: {query}",
        "stream": False
    }

    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json().get("response", "No research found.")
        print("\n--- Research Summary ---\n")
        print(result)
    except Exception as e:
        print(f"Error: Could not connect to Ollama. Make sure it's running locally. ({e})")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 research_agent.py \"Your Research Query\"")
    else:
        run_research(" ".join(sys.argv[1:]))
