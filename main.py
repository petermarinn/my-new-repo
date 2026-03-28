import click
import os
from dotenv import load_dotenv

load_dotenv()

@click.group()
def cli():
    """Simple AI CLI Tool for Debian."""
    pass

@cli.command()
@click.argument('prompt')
def ask(prompt):
    """Ask a question to the (simulated) AI."""
    click.echo(f"Thinking about: {prompt}...")
    # In a real app, you would use openai here.
    # For this starter, we'll simulate a response.
    click.echo(f"AI Response: This is a simulated response for '{prompt}' on Debian.")

@cli.command()
def version():
    """Show the version of the tool."""
    click.echo("Debian AI CLI version 1.0.0")

if __name__ == '__main__':
    cli()
