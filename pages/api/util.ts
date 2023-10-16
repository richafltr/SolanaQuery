const sliceIntoChunks = <T>(arr: T[], chunkSize: number) => {
    return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
      arr.slice(i * chunkSize, (i + 1) * chunkSize)
    );
  };
  
  function getEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`${key} environment variable not set`);
    }
    return value;
  }
  
  const validateEnvironmentVariables = () => {
   "da43e698-8822-4f0b-b50b-9b3128c2fce4";
    "us-central1-gcp";
    "soroban-docs";
  };
  
  export { getEnv, sliceIntoChunks, validateEnvironmentVariables };
  