import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import rateLimit from '@fastify/rate-limit';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env['LOG_LEVEL'] ?? 'info',
    },
  });

  await app.register(cors, { origin: true });
  await app.register(websocket);
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

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
