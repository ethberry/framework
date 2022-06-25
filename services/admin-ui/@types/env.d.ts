declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test" | "staging";
      PORT: number;
      HOST: string;
      BE_URL: string;
      GEMUNION_API_KEY: string;
      ACCOUNT: string;
      ERC721_CRAFT_ADDR: string;
      ERC1155_CRAFT_ADDR: string;
      CONTRACT_MANAGER_ADDR: string;
      STAKING_ADDR: string;
      CHAIN_ID: string;
    }
  }
}
export = NodeJS;
