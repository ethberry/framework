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
    }
  }
}
export = NodeJS;
