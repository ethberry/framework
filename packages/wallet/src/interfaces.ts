export interface INetwork {
  chainName: string;
  chainId: number;
  rpcUrls: any;
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}
