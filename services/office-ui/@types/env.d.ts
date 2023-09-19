import { NodeEnv } from "@framework/types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: NodeEnv;
      PORT: number;
      HOST: string;
      BE_URL: string;
      JSON_URL: string;
      GEMUNION_API_KEY: string;
      ACCOUNT: string;
      CONTRACT_MANAGER_ADDR: string;
      EXCHANGE_ADDR: string;
      CHAIN_ID: string;
      LINK_ADDR: string;
      STAKING_ADDR: string;
      DISPENSER_ADDR: string;
    }
  }
}
export = NodeJS;
