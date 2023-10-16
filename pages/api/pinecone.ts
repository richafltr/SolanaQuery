import { PineconeClient } from "@pinecone-database/pinecone";
import { getEnv, validateEnvironmentVariables } from "./util";


let pineconeClient: PineconeClient | null = null;

// Returns a Promise that resolves to a PineconeClient instance
export const getPineconeClient = async (): Promise<PineconeClient> => {
  validateEnvironmentVariables();

  if (pineconeClient) {
    return pineconeClient;
  } else {
    pineconeClient = new PineconeClient();

    await pineconeClient.init({
      apiKey:"da43e698-8822-4f0b-b50b-9b3128c2fce4",
      environment: "us-central1-gcp",
    });
  }
  return pineconeClient;
};
