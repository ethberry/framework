export interface ICollectionDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  batchSize: bigint;
  contractTemplate: string;
}

export interface IContractManagerCollectionDeployedEvent {
  account: string;
  externalId: number;
  args: ICollectionDeployedEventArgs;
}
