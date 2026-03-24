# OpenDev Agent Platform

Bootstrap inicial del monorepo para iniciar el desarrollo de OpenDev Agent Platform, basado en la especificación de `opendev-codex-prompt.md`.

## Estado actual

- ✅ Configuración raíz de monorepo (pnpm + turbo + tsconfig base).
- ✅ Variables de entorno de ejemplo e infraestructura base (Docker + CI workflows).
- ✅ Paquete `@opendev/core` con:
  - contratos base de modelos,
  - registro de modelos,
  - adaptador `mock` para desarrollo local,
  - orquestador con planner + executor + context manager,
  - tests unitarios iniciales.
- ⏳ Pendiente: implementación completa de `server`, `web`, `cli`, `vscode` y `docs`.

## Próximo sprint sugerido

1. Crear `packages/server` con Fastify + tRPC + health routes.
2. Exponer endpoint de sesiones y mensajes que use `AgentOrchestrator`.
3. Conectar `packages/web` a server con streaming básico.

## Comandos

```bash
pnpm install
pnpm test
pnpm dev
```

## Web y GitHub Pages

Si en GitHub Pages no se veía nada era porque no existía aún `packages/web` ni workflow de despliegue.

Ahora ya están:

- `packages/web` (React + Vite)
- `.github/workflows/pages.yml` para build y deploy automático en `main`

> Para que publique correctamente, en GitHub ve a **Settings → Pages → Source: GitHub Actions**.
