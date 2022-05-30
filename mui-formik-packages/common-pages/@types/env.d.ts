declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BE_URL: string;
    }
  }
}

export {};
