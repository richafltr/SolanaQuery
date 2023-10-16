import { Vector } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from "uuid";
import { openai } from "./openaiClient";
import { sliceIntoChunks } from "./util"
class Embedder {
  async embed(text: string): Promise<Vector> {
    const sanitizedText = text.trim().replaceAll('\n', ' ');

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: sanitizedText,
    });

    if (embeddingResponse.status !== 200) {
      const errorResponse = await embeddingResponse.json();
      console.error('OpenAI Error:', errorResponse); // Log the error response for better debugging.
      throw new Error('Failed to create embedding for text');
    }

    const {
      data: [{ embedding }],
    } = await embeddingResponse.json();

    return {
      id: uuidv4(),
      metadata: {
        text: sanitizedText,
      },
      values: Array.from(embedding),
    };
  }

  async embedBatch(
    texts: string[],
    batchSize: number,
    onDoneBatch: (embeddings: Vector[]) => void
  ) {
    const batches = sliceIntoChunks<string>(texts, batchSize);
    for (const batch of batches) {
      const embeddings = await Promise.all(
        batch.map((text) => this.embed(text))
      );
      await onDoneBatch(embeddings);
    }
  }
}

const embedder = new Embedder();

export { embedder };
