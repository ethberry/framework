declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test" | "staging";
      PORT: number;
      HOST: string;
      BE_URL: string;
      GEMUNION_API_KEY: string;
      ACCOUNT: string;
      ERC721_MARKETPLACE_ADDR: string;
      ERC721_AIRDROP_ADDR: string;
      ERC721_CRAFT_ADDR: string;
      ERC1155_MARKETPLACE_ADDR: string;
      ERC1155_CRAFT_ADDR: string;
      ERC1155_RESOURCES_ADDR: string;
      CHAIN_ID: string;
      SEAPORT_ADDR: string;
    }
  }
}
export = NodeJS;
