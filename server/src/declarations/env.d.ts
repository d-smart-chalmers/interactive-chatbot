declare namespace NodeJS {
  interface ProcessEnv {
    SESSION_SECRET: string;
    CLIENT_URL: string;
    CEREBRAS_API_KEY: string;
    ANTHROPIC_API_KEY: string;
    OPENAI_API_KEY: string;
  }
}
