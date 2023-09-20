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
      CHAIN_ID: string;
      LINK_ADDR: string;
      STAKING_ADDR: string;
    }
  }
}
export = NodeJS;
