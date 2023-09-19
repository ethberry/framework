import { BusinessType, NodeEnv } from "@framework/types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: NodeEnv;
      PORT: number;
      HOST: string;
      BE_URL: string;
      JSON_URL: string;
      GEMUNION_API_KEY: string;
      GEMUNION_URL: string;
      BUSINESS_TYPE: BusinessType;
      ACCOUNT: string;
      // these addresses should be related to chainId
      CONTRACT_MANAGER_ADDR: string;
      LINK_ADDR: string;
      VRF_ADDR: string;
      CHAINLINK_SUBSCRIPTION_ID: string;
    }
  }
}
export = NodeJS;
