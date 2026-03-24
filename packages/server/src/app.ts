import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import rateLimit from '@fastify/rate-limit';
import fastStatic from '@fastify/static';
import path from 'node:path';
import fs from 'node:fs';

export interface AppOptions {
  webDistPath?: string;
}

export async function buildApp(options: AppOptions = {}) {
  const app = Fastify({
    logger: {
      level: process.env['LOG_LEVEL'] ?? 'info',
    },
  });

  await app.register(cors, { origin: true });
  await app.register(websocket);
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  // Static files for the web interface
  if (options.webDistPath && fs.existsSync(options.webDistPath)) {
    await app.register(fastStatic, {
      root: options.webDistPath,
      prefix: '/',
    });

    // Handle SPA routing
    app.setNotFoundHandler((_req, reply) => {
      (reply as any).sendFile('index.html');
    });
  }

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  }));

  // Models endpoint
  app.get('/api/models', async () => {
    const { modelRegistry } = await import('@opendev/core');
    const models = await modelRegistry.listAll();
    return { models };
  });

  // WebSocket endpoint for streaming
  await app.register(async (fastify) => {
    fastify.get('/ws/agent/:sessionId', { websocket: true }, async (socket, req) => {
      const { handleAgentWebSocket } = await import('./ws/handler.js');
      await handleAgentWebSocket(socket, req);
    });
  });

  return app;
}
