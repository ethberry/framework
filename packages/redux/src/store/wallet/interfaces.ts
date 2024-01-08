export interface IWalletState {
  isDialogOpen: boolean;
  activeConnector: TConnectors | null;
  network: INetwork | null;
  networks: Record<number, INetwork>;
  wallets: any[];
  activeWallets: any[];
  resolve: (() => (context: any) => void) | null;
}

export enum TConnectors {
  METAMASK = "METAMASK",
  PARTICLE = "PARTICLE",
  WALLETCONNECT = "WALLETCONNECT",
}

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

export enum Networks {
  ETHEREUM = "ETHEREUM",
  GOERLY = "GOERLY",
  BINANCE = "BINANCE",
  BINANCE_TEST = "BINANCE_TEST",
  POLYGON = "POLYGON",
  MUMBAI = "MUMBAI",
  OPTIMISM = "OPTIMISM",
  ARBITRUM = "ARBITRUM",
  BESU = "BESU",
  GEMUNION = "GEMUNION",
}
