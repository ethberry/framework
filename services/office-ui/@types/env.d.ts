import { NodeEnv } from "@ethberry/constants";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: NodeEnv;
      PORT: number;
      HOST: string;
      BE_URL: string;
      JSON_URL: string;
      ETHBERRY_API_KEY: string;
      ACCOUNT: string;
      // these addresses should be related to chainId
      LINK_ADDR: string;
    }
  }
}
export = NodeJS;
