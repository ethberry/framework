declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test" | "staging";
      PORT: number;
      HOST: string;
      BE_URL: string;
      GEMUNION_API_KEY: string;
    }
  }
}
export = NodeJS;
