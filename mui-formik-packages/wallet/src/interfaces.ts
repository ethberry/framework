export interface INetwork {
  chainName: string;
  chainId: any;
  rpcUrls: any;
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}
