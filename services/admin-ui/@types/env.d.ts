import { BusinessType } from "@framework/types";
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
      ETHBERRY_URL: string;
      SIGNAL_URL: string;
      BUSINESS_TYPE: BusinessType;
      ACCOUNT: string;
      // these addresses should be related to chainId
      LINK_ADDR: string;
      VRF_ADDR: string;
      CHAINLINK_SUBSCRIPTION_ID: string;
    }
  }
}
export = NodeJS;
