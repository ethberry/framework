declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test" | "staging";
      PORT: number;
      HOST: string;
      BE_URL: string;
      MARKET_FE_URL: string;
      GEMUNION_API_KEY: string;
      ACCOUNT: string;
      EXCHANGE_ADDR: string;
      STAKING_ADDR: string;
      LOTTERY_ADDR: string;
      PYRAMID_ADDR: string;
      RAFFLE_ADDR: string;
      WAITLIST_ADDR: string;
      CHAIN_ID: string;
    }
  }
}
export = NodeJS;
