declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test" | "staging";
      PORT: number;
      HOST: string;
      BE_URL: string;
      GEMUNION_API_KEY: string;
      ACCOUNT: string;
      CLAIM_PROXY_ADDR: string;
      EXCHANGE_ADDR: string;
      STAKING_ADDR: string;
      CHAIN_ID: string;
      METADATA_ADDR: string;
    }
  }
}
export = NodeJS;
