import { StreamChunk } from '../models/base.js';

/**
 * Utility to collect all text from a stream into a single string.
 */
export async function collectStream(
  stream: AsyncGenerator<StreamChunk>
): Promise<string> {
  let result = '';
  for await (const chunk of stream) {
    if (chunk.type === 'text' && chunk.content) {
      result += chunk.content;
    }
  }
  return result;
}

/**
 * Pipes a stream to a writer function (e.g., SSE or WebSocket).
 */
export async function pipeStream(
  stream: AsyncGenerator<StreamChunk>,
  writer: (chunk: StreamChunk) => void
): Promise<void> {
  for await (const chunk of stream) {
    writer(chunk);
  }
}

/**
 * Creates an async generator from an array of chunks (useful for testing).
 */
export async function* fromChunks(chunks: StreamChunk[]): AsyncGenerator<StreamChunk> {
  for (const chunk of chunks) {
    yield chunk;
  }
}
