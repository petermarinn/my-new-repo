# Debian AI CLI Project Starter

A lightweight AI-ready CLI application template for Debian Linux systems. This starter comes pre-configured with essential AI libraries and CLI interaction tools.

## Prerequisites (Debian)

To set up your environment, install the necessary Debian packages:

```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv build-essential
```

## Getting Started

### 1. Create a Virtual Environment

It is recommended to use a virtual environment to manage dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

Install the required Python packages from `requirements.txt`:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file to store your API keys:

```bash
touch .env
echo "OPENAI_API_KEY=your_key_here" >> .env
```

## Running the Application

The application is a CLI tool built with `click`. Here are some common commands:

### Ask a question
```bash
python3 main.py ask "What is Debian?"
```

### Check the version
```bash
python3 main.py version
```

### Help
```bash
python3 main.py --help
```

## License

This project is licensed under the MIT License.
