# OpenDev Agent Platform

AI coding agent platform — open source alternative to Claude Code.
Supports Anthropic, OpenAI, Google Gemini, and local models via Ollama.

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Start development
pnpm dev

# Run CLI agent
pnpm cli run "Create a REST API with Express and TypeScript"

# Start web UI
open http://localhost:5173
```

## Packages

| Package | Description |
|---------|-------------|
| `@opendev/core` | Agent orchestrator, model adapters, tools |
| `@opendev/cli` | Terminal interface (Ink + Commander) |
| `@opendev/server` | Fastify API + WebSocket streaming |
| `@opendev/web` | React web interface |
| `@opendev/vscode` | VS Code extension |

## Supported Models

- **Anthropic**: Claude Opus 4.5, Claude Sonnet 4.5, Claude Haiku 4.5
- **OpenAI**: GPT-4o, GPT-4o Mini, o1-preview
- **Google**: Gemini 2.0 Flash, Gemini 2.0 Pro
- **Local**: Any model via Ollama (Llama 3, Mistral, CodeLlama, etc.)

## Architecture

See [docs/index.md](docs/index.md) for the full system design.
