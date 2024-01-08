export interface INetwork {
  chainName: string;
  chainId: number;
  rpcUrls: any;
  blockExplorerUrls: string[];
  isSandbox?: boolean;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
}
