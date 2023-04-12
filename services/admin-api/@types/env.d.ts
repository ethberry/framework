declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test" | "staging";
      PORT: number;
      HOST: string;
      BE_URL: string;
      JSON_URL: string;
      GEMUNION_API_KEY: string;
      ACCOUNT: string;
      CONTRACT_MANAGER_ADDR: string;
      EXCHANGE_ADDR: string;
      STAKING_ADDR: string;
      CHAIN_ID: string;
      LINK_ADDR: string;
      WAITLIST_ADDR: string;
      LOTTERY_ADDR: string;
    }
  }
}
export = NodeJS;
