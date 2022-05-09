declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test" | "staging";
      PORT: number;
      HOST: string;
      BE_URL: string;
      GEMUNION_API_KEY: string;
      ERC20_COIN: string;
      ERC721_CRAFT_ADDR: string;
      ERC1155_CRAFT_ADDR: string;
    }
  }
}
export = NodeJS;
