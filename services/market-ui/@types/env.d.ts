import { NodeEnv } from "@framework/types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: NodeEnv;
      PORT: number;
      HOST: string;
      BE_URL: string;
      MARKET_FE_URL: string;
      GEMUNION_API_KEY: string;
      ACCOUNT: string;
      // these addresses should be related to chainId
      EXCHANGE_ADDR: string;
      STAKING_ADDR: string;
      LOTTERY_ADDR: string;
      PYRAMID_ADDR: string;
      RAFFLE_ADDR: string;
      WAITLIST_ADDR: string;
      CONTRACT_MANAGER_ADDR: string;
    }
  }
}
export = NodeJS;
