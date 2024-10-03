export interface IERC998TokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerERC998TokenDeployedEvent {
  account: string;
  externalId: number;
  args: IERC998TokenDeployedEventArgs;
}
