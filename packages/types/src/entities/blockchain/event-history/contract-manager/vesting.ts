export interface IVestingTokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerVestingTokenDeployedEvent {
  account: string;
  externalId: number;
  args: IVestingTokenDeployedEventArgs;
}
