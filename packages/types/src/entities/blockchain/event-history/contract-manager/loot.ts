export interface ILootTokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerLootTokenDeployedEvent {
  account: string;
  externalId: number;
  args: ILootTokenDeployedEventArgs;
}
