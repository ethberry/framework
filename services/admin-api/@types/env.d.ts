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
      CONTRACT_MANAGER_ADDR: string;
      EXCHANGE_ADDR: string;
      STAKING_ADDR: string;
      CHAIN_ID_ETHBERRY_BESU: string;
      WAIT_LIST_ADDR: string;
      LOTTERY_ADDR: string;

      // MODULE:CHAINLINK
      VRF_ADDR: string;
      LINK_ADDR: string;
    }
  }
}
export = NodeJS;
