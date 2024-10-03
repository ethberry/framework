export interface IMysteryTokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerMysteryTokenDeployedEvent {
  account: string;
  externalId: number;
  args: IMysteryTokenDeployedEventArgs;
}
