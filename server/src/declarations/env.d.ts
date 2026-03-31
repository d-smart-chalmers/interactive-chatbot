declare namespace NodeJS {
  interface ProcessEnv {
    SESSION_SECRET: string;
    CLIENT_URL: string;
    CEREBRAS_API_KEY: string;
  }
}
