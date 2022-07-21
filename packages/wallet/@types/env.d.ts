declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CHAIN_ID: string;
      JSON_RPC_ADDR: string;
    }
  }
}

export {};
