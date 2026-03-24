/**
 * Embeddings module — wraps a text embedding provider.
 * In production, wire this to an embeddings API (OpenAI, Cohere, etc.)
 */
export class EmbeddingsService {
  async embed(text: string): Promise<number[]> {
    // Placeholder: returns a deterministic pseudo-embedding based on character codes
    // Replace with real API call in production
    const normalized = text.slice(0, 512);
    const embedding = Array.from({ length: 384 }, (_, i) =>
      Math.sin(normalized.charCodeAt(i % normalized.length) + i) * 0.1
    );
    return embedding;
  }

  cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += (a[i] ?? 0) * (b[i] ?? 0);
      normA += (a[i] ?? 0) ** 2;
      normB += (b[i] ?? 0) ** 2;
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }
}

export const embeddingsService = new EmbeddingsService();
