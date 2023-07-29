declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test" | "staging";
      PORT: number;
      HOST: string;
      BE_URL: string;
      JSON_URL: string;
      CHAIN_ID: string;
      GEMUNION_API_KEY: string;
      GEMUNION_URL: string;
      BUSINESS_TYPE: string;
      ACCOUNT: string;
      CONTRACT_MANAGER_ADDR: string;
      EXCHANGE_ADDR: string;
      LINK_ADDR: string;
      VRF_ADDR: string;
      CHAINLINK_SUBSCRIPTION_ID: string;
      DISPENSER_ADDR: string;
    }
  }
}
export = NodeJS;
