import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';
import { AgentOrchestrator } from '@opendev/core';

interface AgentMessage {
  type: 'message';
  content: string;
  model?: string;
  workdir?: string;
}

export async function handleAgentWebSocket(
  socket: WebSocket,
  _req: FastifyRequest
) {
  let agent: AgentOrchestrator | null = null;

  socket.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString()) as AgentMessage;

      if (msg.type === 'message') {
        if (!agent) {
          agent = new AgentOrchestrator({
            modelId: msg.model ?? 'anthropic/claude-sonnet-4-5',
            workdir: msg.workdir ?? process.cwd(),
          });
        }

        for await (const event of agent.run(msg.content)) {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(event));
          }
        }
      }
    } catch (err) {
      socket.send(JSON.stringify({
        type: 'error',
        error: err instanceof Error ? err.message : String(err),
      }));
    }
  });

  socket.on('close', () => {
    agent = null;
  });
}
