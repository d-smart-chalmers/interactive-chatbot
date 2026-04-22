declare namespace NodeJS {
  interface ProcessEnv {
    SESSION_SECRET: string;
    CLIENT_URL: string;
    CEREBRAS_API_KEY: string; //TODO: Remove
    ANTHROPIC_API_KEY: string; //TODO: Remove
    OPENAI_API_KEY: string;
    OPENAI_BASE_URL: string;
    BASE_PATH: string;
  }
}
