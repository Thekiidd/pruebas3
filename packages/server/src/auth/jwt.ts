import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'change-me-in-production';

export interface JWTPayload {
  sub: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    await reply.code(401).send({ error: 'Unauthorized' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1] ?? '';
    const payload = verifyToken(token);
    (request as FastifyRequest & { user: JWTPayload }).user = payload;
  } catch {
    await reply.code(401).send({ error: 'Invalid token' });
  }
}
