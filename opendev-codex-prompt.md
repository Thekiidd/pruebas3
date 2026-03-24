# PROMPT MAESTRO — OpenDev Agent Platform
> Pega este prompt completo en OpenAI Codex, Claude Code, Cursor Agent, o cualquier agente de codificación.
> El agente debe leer TODO antes de escribir una sola línea de código.

---

## ROL Y OBJETIVO

Eres un ingeniero senior de software. Tu tarea es crear desde cero un proyecto completo llamado **OpenDev Agent Platform** — una plataforma de agente de codificación de código abierto, equivalente a Claude Code u OpenHands, pero multi-modelo y con interfaz web, CLI y extensión de VS Code.

**Construye TODO el proyecto en una sola sesión.** No omitas archivos. No uses placeholders como `// TODO` ni `// implement later`. Cada archivo debe tener código real y funcional.

---

## STACK TECNOLÓGICO OBLIGATORIO

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Lenguaje | TypeScript | 5.x strict mode |
| Runtime | Node.js | 22 LTS |
| Gestor de paquetes | pnpm | 9.x |
| Monorepo | Turborepo | latest |
| Backend API | Fastify | 5.x |
| API type-safe | tRPC | 11.x |
| Frontend | React + Vite | 19 + 6 |
| Estilos | Tailwind CSS | 4.x |
| Estado global | Zustand | 5.x |
| Data fetching | TanStack Query | 5.x |
| CLI UI | Ink | 5.x |
| CLI commands | Commander.js | 12.x |
| ORM | Drizzle ORM | latest |
| Base de datos | SQLite (dev) / PostgreSQL (prod) | — |
| Vector DB | ChromaDB client | latest |
| Validación | Zod | 3.x |
| Testing | Vitest | latest |
| Seguridad de secrets | Keytar | latest |
| Observabilidad | OpenTelemetry | latest |
| Contenedores | Docker + docker-compose | — |
| CI/CD | GitHub Actions | — |

---

## ESTRUCTURA COMPLETA DEL MONOREPO

Crea exactamente esta estructura de archivos y directorios:

```
opendev/
├── package.json                          # pnpm workspaces root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .gitignore
├── .env.example
├── docker-compose.yml
├── docker-compose.prod.yml
├── README.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── packages/
│   ├── core/                             # Lógica central compartida
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── agent/
│   │   │   │   ├── orchestrator.ts       # Orquestador principal del agente
│   │   │   │   ├── planner.ts            # Planificador de tareas
│   │   │   │   ├── executor.ts           # Ejecutor del loop herramientas
│   │   │   │   ├── context-manager.ts    # Gestión de ventana de contexto
│   │   │   │   └── types.ts
│   │   │   ├── models/
│   │   │   │   ├── base.ts               # Interfaz base para todos los modelos
│   │   │   │   ├── anthropic.ts          # Adaptador Anthropic Claude
│   │   │   │   ├── openai.ts             # Adaptador OpenAI GPT
│   │   │   │   ├── gemini.ts             # Adaptador Google Gemini
│   │   │   │   ├── ollama.ts             # Adaptador Ollama (local)
│   │   │   │   ├── registry.ts           # Registro y selección de modelos
│   │   │   │   └── types.ts
│   │   │   ├── tools/
│   │   │   │   ├── base.ts               # Interfaz base para herramientas
│   │   │   │   ├── filesystem.ts         # Leer/escribir/listar archivos
│   │   │   │   ├── shell.ts              # Ejecutar comandos (sandbox)
│   │   │   │   ├── web-search.ts         # Búsqueda web (Brave/Tavily)
│   │   │   │   ├── git.ts                # Operaciones git
│   │   │   │   ├── browser.ts            # Automatización de browser (Playwright)
│   │   │   │   ├── code-analysis.ts      # LSP, análisis de código
│   │   │   │   ├── registry.ts           # Registro de herramientas disponibles
│   │   │   │   └── types.ts
│   │   │   ├── memory/
│   │   │   │   ├── conversation.ts       # Historial de conversación
│   │   │   │   ├── embeddings.ts         # Generación de embeddings
│   │   │   │   ├── vector-store.ts       # Cliente ChromaDB
│   │   │   │   ├── summarizer.ts         # Resumen automático de contexto largo
│   │   │   │   └── types.ts
│   │   │   ├── mcp/
│   │   │   │   ├── client.ts             # Cliente MCP estándar
│   │   │   │   ├── server-manager.ts     # Gestión de servidores MCP
│   │   │   │   └── types.ts
│   │   │   ├── security/
│   │   │   │   ├── sandbox.ts            # Sandbox para ejecución de comandos
│   │   │   │   ├── validator.ts          # Validación Zod de inputs
│   │   │   │   ├── permissions.ts        # Sistema de permisos
│   │   │   │   └── secrets.ts            # Gestión segura de API keys
│   │   │   └── utils/
│   │   │       ├── logger.ts             # Logger con OpenTelemetry
│   │   │       ├── retry.ts              # Retry con backoff exponencial
│   │   │       ├── streaming.ts          # Utilidades para streaming de tokens
│   │   │       └── tokens.ts             # Conteo y gestión de tokens
│   │   └── tests/
│   │       ├── agent/
│   │       │   └── orchestrator.test.ts
│   │       ├── models/
│   │       │   └── registry.test.ts
│   │       └── tools/
│   │           └── filesystem.test.ts
│   │
│   ├── cli/                              # Interfaz de línea de comandos
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts                  # Entry point, bin
│   │   │   ├── commands/
│   │   │   │   ├── run.ts                # opendev run "tarea"
│   │   │   │   ├── chat.ts               # opendev chat (modo interactivo)
│   │   │   │   ├── init.ts               # opendev init (inicializar proyecto)
│   │   │   │   ├── config.ts             # opendev config
│   │   │   │   └── models.ts             # opendev models (listar/configurar)
│   │   │   └── ui/
│   │   │       ├── App.tsx               # Componente raíz Ink
│   │   │       ├── ChatView.tsx          # Vista de chat interactivo
│   │   │       ├── StreamingOutput.tsx   # Streaming de tokens en terminal
│   │   │       ├── ToolCallView.tsx      # Mostrar llamadas a herramientas
│   │   │       ├── ProgressBar.tsx
│   │   │       └── theme.ts              # Colores y estilos del CLI
│   │   └── tests/
│   │       └── commands/
│   │           └── run.test.ts
│   │
│   ├── server/                           # API backend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts                  # Entry point, inicia Fastify
│   │   │   ├── app.ts                    # Configuración de la app Fastify
│   │   │   ├── routes/
│   │   │   │   ├── health.ts
│   │   │   │   ├── sessions.ts           # CRUD de sesiones de agente
│   │   │   │   ├── messages.ts           # Enviar mensajes al agente
│   │   │   │   └── models.ts             # Listar modelos disponibles
│   │   │   ├── trpc/
│   │   │   │   ├── router.ts             # Router tRPC principal
│   │   │   │   ├── agent.router.ts       # Procedimientos del agente
│   │   │   │   ├── sessions.router.ts
│   │   │   │   └── context.ts            # Contexto tRPC
│   │   │   ├── ws/
│   │   │   │   ├── handler.ts            # WebSocket handler para streaming
│   │   │   │   └── events.ts             # Tipos de eventos WS
│   │   │   ├── db/
│   │   │   │   ├── schema.ts             # Schema Drizzle ORM
│   │   │   │   ├── migrations/
│   │   │   │   │   └── 0001_initial.sql
│   │   │   │   └── client.ts             # Cliente de DB
│   │   │   ├── auth/
│   │   │   │   ├── jwt.ts                # Generación y validación JWT
│   │   │   │   └── middleware.ts         # Middleware de autenticación
│   │   │   └── plugins/
│   │   │       ├── cors.ts
│   │   │       ├── rate-limit.ts
│   │   │       └── telemetry.ts
│   │   └── tests/
│   │       └── routes/
│   │           └── sessions.test.ts
│   │
│   ├── web/                              # Interfaz web React
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   │   ├── chat/
│   │   │   │   │   ├── ChatPanel.tsx     # Panel principal de chat
│   │   │   │   │   ├── MessageList.tsx   # Lista de mensajes
│   │   │   │   │   ├── MessageInput.tsx  # Input de mensaje con shortcuts
│   │   │   │   │   ├── StreamingMessage.tsx # Mensaje con streaming de tokens
│   │   │   │   │   └── ToolCallCard.tsx  # Card para mostrar tool calls
│   │   │   │   ├── editor/
│   │   │   │   │   ├── CodeEditor.tsx    # Monaco Editor integrado
│   │   │   │   │   ├── DiffViewer.tsx    # Vista de diff de código
│   │   │   │   │   └── FileTree.tsx      # Árbol de archivos del proyecto
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── SessionList.tsx   # Historial de sesiones
│   │   │   │   │   └── ModelSelector.tsx # Selector de modelo IA
│   │   │   │   └── shared/
│   │   │   │       ├── Button.tsx
│   │   │   │       ├── Badge.tsx
│   │   │   │       ├── Spinner.tsx
│   │   │   │       └── Toast.tsx
│   │   │   ├── stores/
│   │   │   │   ├── agent.store.ts        # Estado del agente (Zustand)
│   │   │   │   ├── session.store.ts      # Sesiones activas
│   │   │   │   └── settings.store.ts     # Configuración de usuario
│   │   │   ├── hooks/
│   │   │   │   ├── useAgent.ts           # Hook principal del agente
│   │   │   │   ├── useStreaming.ts        # Hook para streaming WS
│   │   │   │   ├── useSession.ts
│   │   │   │   └── useModels.ts
│   │   │   ├── lib/
│   │   │   │   ├── trpc.ts               # Cliente tRPC
│   │   │   │   ├── ws.ts                 # Cliente WebSocket
│   │   │   │   └── api.ts                # Helpers de API
│   │   │   └── styles/
│   │   │       └── globals.css           # Tailwind base styles
│   │   └── tests/
│   │       └── components/
│   │           └── ChatPanel.test.tsx
│   │
│   └── vscode/                           # Extensión VS Code
│       ├── package.json                  # Manifest de la extensión
│       ├── tsconfig.json
│       ├── src/
│       │   ├── extension.ts              # Entry point de la extensión
│       │   ├── commands/
│       │   │   ├── openChat.ts
│       │   │   ├── runTask.ts
│       │   │   └── explainCode.ts
│       │   ├── webview/
│       │   │   ├── provider.ts           # WebviewProvider
│       │   │   └── panel.ts              # Panel lateral
│       │   └── utils/
│       │       ├── workspace.ts          # Utilidades de workspace VS Code
│       │       └── editor.ts             # Integración con el editor activo
│       └── tests/
│           └── extension.test.ts
└── docs/                                 # Documentación VitePress
    ├── package.json
    ├── .vitepress/
    │   └── config.ts
    └── index.md
```

---

## ARCHIVOS DE CONFIGURACIÓN RAÍZ

### `package.json` (raíz)
```json
{
  "name": "opendev",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "cli": "pnpm --filter @opendev/cli run dev"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5.5.0",
    "@types/node": "^22.0.0",
    "prettier": "^3.3.0",
    "eslint": "^9.0.0"
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - 'packages/*'
  - 'docs'
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

### `tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### `.env.example`
```
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
OPENAI_API_KEY=sk-...

# Google Gemini
GOOGLE_AI_API_KEY=...

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434

# Web Search
BRAVE_API_KEY=...
TAVILY_API_KEY=...

# Database
DATABASE_URL=sqlite:./dev.db

# ChromaDB
CHROMA_URL=http://localhost:8000

# Auth
JWT_SECRET=change-me-in-production

# Server
PORT=3000
NODE_ENV=development
```

---

## IMPLEMENTACIÓN DETALLADA — PAQUETE `core`

### `packages/core/src/models/base.ts`
Define la interfaz base que TODOS los adaptadores de modelo deben implementar:

```typescript
import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system', 'tool']),
  content: z.string().or(z.array(z.any())),
  tool_call_id: z.string().optional(),
  tool_calls: z.array(z.any()).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ModelConfigSchema = z.object({
  model: z.string(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(4096),
  topP: z.number().min(0).max(1).optional(),
  stream: z.boolean().default(true),
  systemPrompt: z.string().optional(),
});

export type ModelConfig = z.infer<typeof ModelConfigSchema>;

export interface StreamChunk {
  type: 'text' | 'tool_call' | 'tool_result' | 'done' | 'error';
  content?: string;
  toolCall?: {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
  };
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodSchema;
}

export abstract class BaseModelAdapter {
  abstract readonly provider: string;
  abstract readonly supportedModels: string[];

  abstract streamChat(
    messages: Message[],
    config: ModelConfig,
    tools?: ToolDefinition[]
  ): AsyncGenerator<StreamChunk>;

  abstract listModels(): Promise<string[]>;

  abstract countTokens(text: string): Promise<number>;
}
```

### `packages/core/src/models/anthropic.ts`
Implementa el adaptador completo para Anthropic Claude con streaming real:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { BaseModelAdapter, Message, ModelConfig, StreamChunk, ToolDefinition } from './base.js';
import { z } from 'zod';

export class AnthropicAdapter extends BaseModelAdapter {
  readonly provider = 'anthropic';
  readonly supportedModels = [
    'claude-opus-4-5',
    'claude-sonnet-4-5',
    'claude-haiku-4-5',
  ];

  private client: Anthropic;

  constructor(apiKey?: string) {
    super();
    this.client = new Anthropic({ apiKey: apiKey ?? process.env['ANTHROPIC_API_KEY'] });
  }

  async *streamChat(
    messages: Message[],
    config: ModelConfig,
    tools?: ToolDefinition[]
  ): AsyncGenerator<StreamChunk> {
    const anthropicTools = tools?.map(tool => ({
      name: tool.name,
      description: tool.description,
      input_schema: zodToJsonSchema(tool.inputSchema),
    }));

    const stream = this.client.messages.stream({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      system: config.systemPrompt,
      messages: messages.map(formatMessage),
      tools: anthropicTools,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          yield { type: 'text', content: event.delta.text };
        } else if (event.delta.type === 'input_json_delta') {
          yield { type: 'text', content: event.delta.partial_json };
        }
      } else if (event.type === 'content_block_start') {
        if (event.content_block.type === 'tool_use') {
          yield {
            type: 'tool_call',
            toolCall: {
              id: event.content_block.id,
              name: event.content_block.name,
              arguments: {},
            },
          };
        }
      } else if (event.type === 'message_stop') {
        const finalMessage = await stream.finalMessage();
        yield {
          type: 'done',
          usage: {
            inputTokens: finalMessage.usage.input_tokens,
            outputTokens: finalMessage.usage.output_tokens,
          },
        };
      }
    }
  }

  async listModels(): Promise<string[]> {
    return this.supportedModels;
  }

  async countTokens(text: string): Promise<number> {
    const response = await this.client.messages.countTokens({
      model: 'claude-haiku-4-5',
      messages: [{ role: 'user', content: text }],
    });
    return response.input_tokens;
  }
}

function formatMessage(msg: Message): Anthropic.MessageParam {
  return {
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: typeof msg.content === 'string' ? msg.content : (msg.content as Anthropic.ContentBlock[]),
  };
}

function zodToJsonSchema(schema: z.ZodSchema): Record<string, unknown> {
  // Simplified Zod to JSON Schema conversion
  // In production use the zod-to-json-schema package
  return (schema as any)._def ?? {};
}
```

### `packages/core/src/models/openai.ts`
Adaptador para OpenAI con streaming compatible:

```typescript
import OpenAI from 'openai';
import { BaseModelAdapter, Message, ModelConfig, StreamChunk, ToolDefinition } from './base.js';

export class OpenAIAdapter extends BaseModelAdapter {
  readonly provider = 'openai';
  readonly supportedModels = ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini'];

  private client: OpenAI;

  constructor(apiKey?: string) {
    super();
    this.client = new OpenAI({ apiKey: apiKey ?? process.env['OPENAI_API_KEY'] });
  }

  async *streamChat(
    messages: Message[],
    config: ModelConfig,
    tools?: ToolDefinition[]
  ): AsyncGenerator<StreamChunk> {
    const openaiTools = tools?.map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: { type: 'object', properties: {} }, // expand with zod-to-json-schema
      },
    }));

    const stream = await this.client.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
      messages: messages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      })),
      tools: openaiTools,
    });

    let currentToolCall: { id: string; name: string; args: string } | null = null;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (!delta) continue;

      if (delta.content) {
        yield { type: 'text', content: delta.content };
      }

      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          if (tc.function?.name) {
            currentToolCall = { id: tc.id ?? '', name: tc.function.name, args: '' };
          }
          if (tc.function?.arguments && currentToolCall) {
            currentToolCall.args += tc.function.arguments;
          }
        }
      }

      if (chunk.choices[0]?.finish_reason === 'tool_calls' && currentToolCall) {
        yield {
          type: 'tool_call',
          toolCall: {
            id: currentToolCall.id,
            name: currentToolCall.name,
            arguments: JSON.parse(currentToolCall.args || '{}'),
          },
        };
        currentToolCall = null;
      }

      if (chunk.choices[0]?.finish_reason === 'stop') {
        yield { type: 'done' };
      }
    }
  }

  async listModels(): Promise<string[]> {
    const models = await this.client.models.list();
    return models.data.map(m => m.id).filter(id => id.startsWith('gpt') || id.startsWith('o1'));
  }

  async countTokens(text: string): Promise<number> {
    // Rough estimate: ~4 chars per token
    return Math.ceil(text.length / 4);
  }
}
```

### `packages/core/src/models/ollama.ts`
Adaptador para modelos locales via Ollama:

```typescript
import { BaseModelAdapter, Message, ModelConfig, StreamChunk } from './base.js';

export class OllamaAdapter extends BaseModelAdapter {
  readonly provider = 'ollama';
  readonly supportedModels: string[] = [];

  private baseUrl: string;

  constructor(baseUrl?: string) {
    super();
    this.baseUrl = baseUrl ?? process.env['OLLAMA_BASE_URL'] ?? 'http://localhost:11434';
  }

  async *streamChat(
    messages: Message[],
    config: ModelConfig
  ): AsyncGenerator<StreamChunk> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map(m => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        })),
        stream: true,
        options: {
          temperature: config.temperature,
          num_predict: config.maxTokens,
        },
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value).split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.message?.content) {
            yield { type: 'text', content: data.message.content };
          }
          if (data.done) {
            yield { type: 'done' };
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [];
      const data = await response.json() as { models: Array<{ name: string }> };
      return data.models.map(m => m.name);
    } catch {
      return [];
    }
  }

  async countTokens(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
}
```

### `packages/core/src/models/gemini.ts`
Adaptador para Google Gemini:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseModelAdapter, Message, ModelConfig, StreamChunk } from './base.js';

export class GeminiAdapter extends BaseModelAdapter {
  readonly provider = 'google';
  readonly supportedModels = ['gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-1.5-flash'];

  private client: GoogleGenerativeAI;

  constructor(apiKey?: string) {
    super();
    this.client = new GoogleGenerativeAI(apiKey ?? process.env['GOOGLE_AI_API_KEY'] ?? '');
  }

  async *streamChat(
    messages: Message[],
    config: ModelConfig
  ): AsyncGenerator<StreamChunk> {
    const model = this.client.getGenerativeModel({
      model: config.model,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
      systemInstruction: config.systemPrompt,
    });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
    }));

    const lastMessage = messages[messages.length - 1];
    const lastContent = typeof lastMessage?.content === 'string'
      ? lastMessage.content
      : JSON.stringify(lastMessage?.content);

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastContent ?? '');

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield { type: 'text', content: text };
    }

    yield { type: 'done' };
  }

  async listModels(): Promise<string[]> {
    return this.supportedModels;
  }

  async countTokens(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
}
```

### `packages/core/src/models/registry.ts`
Registro central de todos los adaptadores:

```typescript
import { BaseModelAdapter } from './base.js';
import { AnthropicAdapter } from './anthropic.js';
import { OpenAIAdapter } from './openai.js';
import { GeminiAdapter } from './gemini.js';
import { OllamaAdapter } from './ollama.js';

export class ModelRegistry {
  private adapters = new Map<string, BaseModelAdapter>();

  constructor() {
    // Registrar todos los adaptadores disponibles
    const adapters: BaseModelAdapter[] = [
      new AnthropicAdapter(),
      new OpenAIAdapter(),
      new GeminiAdapter(),
      new OllamaAdapter(),
    ];

    for (const adapter of adapters) {
      for (const model of adapter.supportedModels) {
        this.adapters.set(`${adapter.provider}/${model}`, adapter);
      }
      this.adapters.set(adapter.provider, adapter);
    }
  }

  getAdapter(modelId: string): BaseModelAdapter {
    // Buscar por provider/model o solo por provider
    const adapter = this.adapters.get(modelId)
      ?? this.adapters.get(modelId.split('/')[0] ?? '');

    if (!adapter) {
      throw new Error(`No adapter found for model: ${modelId}. Available: ${this.listAll().join(', ')}`);
    }
    return adapter;
  }

  async listAll(): Promise<string[]> {
    const all: string[] = [];
    const seen = new Set<BaseModelAdapter>();

    for (const adapter of this.adapters.values()) {
      if (seen.has(adapter)) continue;
      seen.add(adapter);
      try {
        const models = await adapter.listModels();
        all.push(...models.map(m => `${adapter.provider}/${m}`));
      } catch {
        // Adapter unavailable (e.g., Ollama not running)
      }
    }
    return all;
  }
}

export const modelRegistry = new ModelRegistry();
```

### `packages/core/src/tools/filesystem.ts`
Herramienta de sistema de archivos con seguridad:

```typescript
import { readFile, writeFile, readdir, stat, mkdir } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { z } from 'zod';
import { BaseTool, ToolResult } from './base.js';

export class FileSystemTool extends BaseTool {
  readonly name = 'filesystem';
  readonly description = 'Read, write, and list files in the project directory';

  private workdir: string;

  constructor(workdir: string) {
    super();
    this.workdir = resolve(workdir);
  }

  readonly actions = {
    read: {
      schema: z.object({ path: z.string() }),
      handler: async ({ path }: { path: string }): Promise<ToolResult> => {
        const safePath = this.resolveSafe(path);
        const content = await readFile(safePath, 'utf-8');
        return { success: true, output: content };
      },
    },

    write: {
      schema: z.object({
        path: z.string(),
        content: z.string(),
        createDirs: z.boolean().default(true),
      }),
      handler: async ({ path, content, createDirs }: { path: string; content: string; createDirs: boolean }): Promise<ToolResult> => {
        const safePath = this.resolveSafe(path);
        if (createDirs) {
          await mkdir(resolve(safePath, '..'), { recursive: true });
        }
        await writeFile(safePath, content, 'utf-8');
        return { success: true, output: `Written ${content.length} bytes to ${path}` };
      },
    },

    list: {
      schema: z.object({
        path: z.string().default('.'),
        recursive: z.boolean().default(false),
      }),
      handler: async ({ path, recursive }: { path: string; recursive: boolean }): Promise<ToolResult> => {
        const safePath = this.resolveSafe(path);
        const entries = await this.listDir(safePath, recursive);
        return { success: true, output: entries.join('\n') };
      },
    },
  };

  private resolveSafe(inputPath: string): string {
    const resolved = resolve(this.workdir, inputPath);
    if (!resolved.startsWith(this.workdir)) {
      throw new Error(`Path traversal detected: ${inputPath}`);
    }
    return resolved;
  }

  private async listDir(dir: string, recursive: boolean): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const results: string[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const fullPath = join(dir, entry.name);
      const relPath = relative(this.workdir, fullPath);
      results.push(entry.isDirectory() ? `${relPath}/` : relPath);

      if (recursive && entry.isDirectory()) {
        results.push(...await this.listDir(fullPath, recursive));
      }
    }
    return results;
  }
}
```

### `packages/core/src/tools/shell.ts`
Herramienta de shell con sandbox:

```typescript
import { spawn } from 'node:child_process';
import { z } from 'zod';
import { BaseTool, ToolResult } from './base.js';

const BLOCKED_COMMANDS = ['rm -rf /', 'mkfs', 'dd if=/dev/zero', ':(){:|:&};:'];
const TIMEOUT_MS = 30_000;

export class ShellTool extends BaseTool {
  readonly name = 'shell';
  readonly description = 'Execute shell commands in the project directory';

  private workdir: string;

  constructor(workdir: string) {
    super();
    this.workdir = workdir;
  }

  readonly actions = {
    exec: {
      schema: z.object({
        command: z.string(),
        timeout: z.number().positive().max(120_000).default(TIMEOUT_MS),
      }),
      handler: async ({ command, timeout }: { command: string; timeout: number }): Promise<ToolResult> => {
        // Security: block dangerous commands
        for (const blocked of BLOCKED_COMMANDS) {
          if (command.includes(blocked)) {
            return { success: false, output: `Blocked command: ${blocked}` };
          }
        }

        return new Promise((resolve) => {
          const proc = spawn('sh', ['-c', command], {
            cwd: this.workdir,
            env: { ...process.env, PATH: process.env['PATH'] },
          });

          let stdout = '';
          let stderr = '';

          proc.stdout.on('data', (data: Buffer) => { stdout += data.toString(); });
          proc.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

          const timer = setTimeout(() => {
            proc.kill('SIGTERM');
            resolve({ success: false, output: `Command timed out after ${timeout}ms` });
          }, timeout);

          proc.on('close', (code) => {
            clearTimeout(timer);
            const output = [stdout, stderr].filter(Boolean).join('\n');
            resolve({
              success: code === 0,
              output: output || `Exit code: ${code}`,
            });
          });
        });
      },
    },
  };
}
```

### `packages/core/src/agent/orchestrator.ts`
El orquestador es el corazón del sistema:

```typescript
import { ModelRegistry } from '../models/registry.js';
import { FileSystemTool } from '../tools/filesystem.js';
import { ShellTool } from '../tools/shell.js';
import { Message, ModelConfig, StreamChunk } from '../models/base.js';
import { z } from 'zod';

export const AgentConfigSchema = z.object({
  modelId: z.string().default('anthropic/claude-sonnet-4-5'),
  workdir: z.string().default(process.cwd()),
  maxIterations: z.number().positive().default(20),
  systemPrompt: z.string().optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

export interface AgentEvent {
  type: 'text' | 'tool_call' | 'tool_result' | 'done' | 'error' | 'iteration';
  content?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: string;
  iteration?: number;
  error?: string;
}

const DEFAULT_SYSTEM_PROMPT = `You are OpenDev, an expert AI coding agent.
You have access to tools to read/write files, execute commands, and search the web.
Think step by step. Use tools to accomplish tasks. Be precise and careful with code changes.
Always verify your work by running tests after making changes.`;

export class AgentOrchestrator {
  private registry: ModelRegistry;
  private config: AgentConfig;
  private tools: Record<string, FileSystemTool | ShellTool>;
  private conversationHistory: Message[] = [];

  constructor(config: Partial<AgentConfig> = {}) {
    this.config = AgentConfigSchema.parse(config);
    this.registry = new ModelRegistry();
    this.tools = {
      filesystem: new FileSystemTool(this.config.workdir),
      shell: new ShellTool(this.config.workdir),
    };
  }

  async *run(userMessage: string): AsyncGenerator<AgentEvent> {
    this.conversationHistory.push({ role: 'user', content: userMessage });

    const modelConfig: ModelConfig = {
      model: this.config.modelId.includes('/')
        ? this.config.modelId.split('/')[1]!
        : this.config.modelId,
      maxTokens: 4096,
      temperature: 0.7,
      stream: true,
      systemPrompt: this.config.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
    };

    const adapter = this.registry.getAdapter(this.config.modelId);

    for (let iteration = 0; iteration < this.config.maxIterations; iteration++) {
      yield { type: 'iteration', iteration };

      let assistantMessage = '';
      const pendingToolCall: { id: string; name: string; args: Record<string, unknown> } | null = null;

      for await (const chunk of adapter.streamChat(this.conversationHistory, modelConfig)) {
        if (chunk.type === 'text' && chunk.content) {
          assistantMessage += chunk.content;
          yield { type: 'text', content: chunk.content };
        }

        if (chunk.type === 'tool_call' && chunk.toolCall) {
          yield {
            type: 'tool_call',
            toolName: chunk.toolCall.name,
            toolArgs: chunk.toolCall.arguments,
          };

          // Execute the tool
          const result = await this.executeTool(chunk.toolCall.name, chunk.toolCall.arguments);
          yield { type: 'tool_result', toolResult: result };

          // Add tool result to history
          this.conversationHistory.push({
            role: 'tool',
            content: result,
            tool_call_id: chunk.toolCall.id,
          });
        }

        if (chunk.type === 'done') {
          if (assistantMessage) {
            this.conversationHistory.push({ role: 'assistant', content: assistantMessage });
          }
          // If no tool calls, task is complete
          if (!pendingToolCall) {
            yield { type: 'done' };
            return;
          }
          break;
        }
      }
    }

    yield { type: 'error', error: `Reached max iterations (${this.config.maxIterations})` };
  }

  private async executeTool(name: string, args: Record<string, unknown>): Promise<string> {
    const [toolName, action] = name.split('_');
    const tool = this.tools[toolName ?? ''];

    if (!tool) {
      return `Error: Tool "${toolName}" not found`;
    }

    try {
      const toolAction = (tool as any).actions?.[action ?? ''];
      if (!toolAction) return `Error: Action "${action}" not found on tool "${toolName}"`;

      const validated = toolAction.schema.parse(args);
      const result = await toolAction.handler(validated);
      return result.success ? result.output : `Error: ${result.output}`;
    } catch (err) {
      return `Error executing ${name}: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): Message[] {
    return [...this.conversationHistory];
  }
}
```

---

## IMPLEMENTACIÓN — CLI (`packages/cli`)

### `packages/cli/src/index.ts`
```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';

const program = new Command()
  .name('opendev')
  .version('0.1.0')
  .description('OpenDev — AI coding agent platform');

program
  .command('chat')
  .description('Start interactive chat with the agent')
  .option('-m, --model <model>', 'Model to use', 'anthropic/claude-sonnet-4-5')
  .option('-d, --dir <dir>', 'Working directory', process.cwd())
  .action(async (opts) => {
    const { ChatView } = await import('./ui/ChatView.js');
    render(React.createElement(ChatView, { model: opts.model, workdir: opts.dir }));
  });

program
  .command('run <task>')
  .description('Run a one-shot task')
  .option('-m, --model <model>', 'Model to use', 'anthropic/claude-sonnet-4-5')
  .option('-d, --dir <dir>', 'Working directory', process.cwd())
  .action(async (task, opts) => {
    const { AgentOrchestrator } = await import('@opendev/core');
    const agent = new AgentOrchestrator({ modelId: opts.model, workdir: opts.dir });

    for await (const event of agent.run(task)) {
      if (event.type === 'text') process.stdout.write(event.content ?? '');
      if (event.type === 'tool_call') console.log(`\n🔧 ${event.toolName}(${JSON.stringify(event.toolArgs)})`);
      if (event.type === 'tool_result') console.log(`✅ ${event.toolResult}`);
      if (event.type === 'done') { console.log('\n\nDone!'); process.exit(0); }
      if (event.type === 'error') { console.error(`\nError: ${event.error}`); process.exit(1); }
    }
  });

program
  .command('models')
  .description('List available models')
  .action(async () => {
    const { modelRegistry } = await import('@opendev/core');
    const models = await modelRegistry.listAll();
    console.log('Available models:\n' + models.map(m => `  - ${m}`).join('\n'));
  });

program.parse();
```

---

## IMPLEMENTACIÓN — SERVER (`packages/server`)

### `packages/server/src/app.ts`
```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './trpc/router.js';
import { createContext } from './trpc/context.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(websocket);

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // WebSocket endpoint for streaming
  app.register(async (fastify) => {
    fastify.get('/ws/agent/:sessionId', { websocket: true }, async (socket, req) => {
      const { handleAgentWebSocket } = await import('./ws/handler.js');
      await handleAgentWebSocket(socket, req);
    });
  });

  return app;
}
```

### `packages/server/src/db/schema.ts`
```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  title: text('title').notNull().default('New session'),
  modelId: text('model_id').notNull(),
  workdir: text('workdir').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  role: text('role', { enum: ['user', 'assistant', 'tool', 'system'] }).notNull(),
  content: text('content').notNull(),
  toolName: text('tool_name'),
  toolArgs: text('tool_args'),
  tokens: integer('tokens'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const apiKeys = sqliteTable('api_keys', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  keyHash: text('key_hash').notNull(), // never store raw keys
  label: text('label'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

---

## IMPLEMENTACIÓN — WEB (`packages/web`)

### `packages/web/src/components/chat/ChatPanel.tsx`
```tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAgent } from '../../hooks/useAgent.js';
import { MessageList } from './MessageList.js';
import { MessageInput } from './MessageInput.js';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const { messages, isStreaming, sendMessage } = useAgent();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isStreaming) return;
    const msg = input;
    setInput('');
    await sendMessage(msg);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList messages={messages} />
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-zinc-800 p-4">
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isStreaming}
        />
      </div>
    </div>
  );
}
```

### `packages/web/src/hooks/useAgent.ts`
```typescript
import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolName?: string;
  isStreaming?: boolean;
}

export function useAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const assistantMsgId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }]);

    // Connect to WebSocket streaming endpoint
    const ws = new WebSocket(`ws://localhost:3000/ws/agent/default`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'message', content }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data as string);

      if (data.type === 'text') {
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: m.content + (data.content as string) }
            : m
        ));
      }

      if (data.type === 'tool_call') {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'tool',
          content: JSON.stringify(data.args),
          toolName: data.name as string,
        }]);
      }

      if (data.type === 'done' || data.type === 'error') {
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId ? { ...m, isStreaming: false } : m
        ));
        setIsStreaming(false);
        ws.close();
      }
    };

    ws.onerror = () => {
      setIsStreaming(false);
    };
  }, []);

  return { messages, isStreaming, sendMessage };
}
```

---

## DOCKER

### `docker-compose.yml`
```yaml
version: '3.9'
services:
  server:
    build:
      context: .
      dockerfile: packages/server/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:/data/opendev.db
    volumes:
      - db-data:/data
      - ./:/workspace:ro
    depends_on:
      - chromadb

  web:
    build:
      context: .
      dockerfile: packages/web/Dockerfile
    ports:
      - "5173:80"
    depends_on:
      - server

  chromadb:
    image: chromadb/chroma:latest
    ports:
      - "8000:8000"
    volumes:
      - chroma-data:/chroma/chroma

volumes:
  db-data:
  chroma-data:
```

---

## GITHUB ACTIONS

### `.github/workflows/ci.yml`
```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - run: pnpm run test
      - run: pnpm run lint
```

---

## README.md (raíz)

```markdown
# OpenDev Agent Platform

AI coding agent platform — open source alternative to Claude Code.
Supports Anthropic, OpenAI, Google Gemini, and local models via Ollama.

## Quick Start

\`\`\`bash
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
\`\`\`

## Packages

| Package | Description |
|---------|-------------|
| `@opendev/core` | Agent orchestrator, model adapters, tools |
| `@opendev/cli` | Terminal interface (Ink + Commander) |
| `@opendev/server` | Fastify API + WebSocket streaming |
| `@opendev/web` | React web interface |
| `@opendev/vscode` | VS Code extension |

## Supported Models

- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **OpenAI**: GPT-4o, GPT-4o Mini, o1-preview
- **Google**: Gemini 2.0 Flash, Gemini 2.0 Pro
- **Local**: Any model via Ollama (Llama 3, Mistral, CodeLlama, etc.)

## Architecture

See [docs/architecture.md](docs/architecture.md) for the full system design.
\`\`\`
```

---

## INSTRUCCIONES FINALES PARA EL AGENTE

1. **Crea todos los archivos listados** — no omitas ninguno, aunque sea pequeño.
2. **Instala todas las dependencias** en los `package.json` correctos de cada paquete.
3. **Cada adaptador de modelo debe compilar sin errores** en TypeScript strict mode.
4. **El CLI debe ser ejecutable** via `npx opendev` o `pnpm cli`.
5. **El servidor debe iniciar** con `pnpm --filter @opendev/server dev`.
6. **La web debe cargar** en `http://localhost:5173`.
7. **Ejecuta `pnpm build`** al final y corrige cualquier error de TypeScript.
8. **Ejecuta `pnpm test`** y asegúrate de que los tests pasen.
9. **Inicializa el repositorio git** con `git init && git add . && git commit -m "feat: initial OpenDev platform"`.
10. **No uses `any` en TypeScript** excepto donde sea absolutamente necesario y documenta el motivo.

El proyecto debe estar listo para que un desarrollador haga `pnpm install && pnpm dev` y tenga todo funcionando.
