declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      JSON_RPC_ADDR_ETHEREUM: string;
      JSON_RPC_ADDR_GORLY: string;
      JSON_RPC_ADDR_BINANCE: string;
      JSON_RPC_ADDR_BINANCE_TEST: string;
      JSON_RPC_ADDR_POLYGON: string;
      JSON_RPC_ADDR_MUMBAI: string;
      JSON_RPC_ADDR_BESU: string;
      JSON_RPC_ADDR_GEMUNION: string;
    }
  }
}
export = NodeJS;
