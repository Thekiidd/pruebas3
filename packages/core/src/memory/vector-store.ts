/**
 * Vector store client wrapping ChromaDB.
 * Falls back to in-memory store when ChromaDB is unavailable.
 */
export interface VectorDocument {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
  embedding?: number[];
}

export class InMemoryVectorStore {
  private documents: VectorDocument[] = [];

  async add(docs: VectorDocument[]): Promise<void> {
    this.documents.push(...docs);
  }

  async query(embedding: number[], topK: number = 5): Promise<VectorDocument[]> {
    // Simple linear scan — replace with ChromaDB in production
    const scored = this.documents.map(doc => ({
      doc,
      score: this.cosineSimilarity(embedding, doc.embedding ?? []),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(s => s.doc);
  }

  async delete(id: string): Promise<void> {
    this.documents = this.documents.filter(d => d.id !== id);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      dot += (a[i] ?? 0) * (b[i] ?? 0);
      normA += (a[i] ?? 0) ** 2;
      normB += (b[i] ?? 0) ** 2;
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }
}

export const vectorStore = new InMemoryVectorStore();
