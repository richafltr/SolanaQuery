# SolanaQuery Documentation Search with Pinecone

SolanaQuery is an advanced tool that harnesses the prowess of OpenAI's GPT-3.5 Turbo model to deliver contextually accurate answers from the Solana documentation. By processing `.mdx` files within the `pages` directory, it acts as a conduit between user inquiries and the expansive knowledge base of Solana.

## Technical Overview

Creating a custom SolanaQuery entails:

1. **👷 Build time**: Pre-process the knowledge base (`.mdx` files in the `pages` folder).
2. **👷 Build time**: Generate embeddings using Pinecone and store them.
3. **🏃 Runtime**: Execute vector similarity search to pinpoint content relevant to the user's query.
4. **🏃 Runtime**: Inject the identified content into the OpenAI GPT-3.5 Turbo model prompt and convey the response to the user.

## 👷 Build Time

Steps 1 and 2 are carried out during the build phase. The [`generate-embeddings`](./lib/generate-embeddings.ts) script is run, which:

- Segments `.mdx` pages into sections.
- Creates embeddings for each section using OpenAI's API.
- Stores the embeddings using Pinecone.

```mermaid
graph TD;
    A[Data Preprocessing] -->|Parse & Translate| B[Embedding Generation];
    B --> C[Hybrid Indexing];
    D[User Query] --> E[Search Engine];
    E -->|Query Processing & Execution| C;
    C --> F[Response Generation];
    F --> G[User Interface];
    G --> D;

```

```mermaid
sequenceDiagram
    participant Vercel
    participant DB (Pinecone)
    participant OpenAI (API)
    loop 1. Pre-process the knowledge base
        Vercel->>Vercel: Segment .mdx pages into sections
        loop 2. Create & store embeddings
            Vercel->>OpenAI (API): create embedding for page section
            OpenAI (API)->>Vercel: embedding vector(1536)
            Vercel->>DB (Pinecone): store embedding for page section
        end
    end
```

## 🏃 Runtime

Steps 3 and 4 are executed during runtime, i.e., when a user submits a query. The procedure involves:

- Creating an embedding for the user's query.
- Performing a vector similarity search to retrieve relevant documentation content.
- Injecting this content into the OpenAI GPT-3.5 Turbo model's prompt.
- Streaming the model's response back to the user.

Relevant files include the [`SearchDialog` (Client)](./components/SearchDialog.tsx) component and the [`vector-search` (Edge Function)](./pages/api/vector-search.ts).

```mermaid
sequenceDiagram
    participant Client
    participant Edge Function
    participant DB (Pinecone)
    participant OpenAI (API)
    Client->>Edge Function: { query: What is a Solana Seed Phrase? }
    critical 3. Perform vector similarity search
        Edge Function->>OpenAI (API): create embedding for query
        OpenAI (API)->>Edge Function: embedding vector(1536)
        Edge Function->>DB (Pinecone): vector similarity search
        DB (Pinecone)->>Edge Function: relevant docs content
    end
    critical 4. Inject content into prompt
        Edge Function->>OpenAI (API): completion request prompt: query + relevant docs content
        OpenAI (API)-->>Client: text/event-stream: completions response
    end
```

## Local Development

### Configuration

- Copy the example environment file: `cp .env.example .env`.
- Set your `OPENAI_KEY`,`PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`, `PINECONE_INDEX`  in the `.env` file.

### Start the Next.js App

```bash
pnpm dev
```

### Custom `.mdx` Docs

1. Ensure your documentation is in `.mdx` format.
2. Regenerate embeddings: `pnpm run embeddings`.
3. Refresh the NextJS localhost:3000 rendered page.

## Further Reading

- Delve into [Pinecone's vector embeddings](https://www.pinecone.io/learn/vector-embeddings/).
