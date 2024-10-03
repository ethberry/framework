export interface IERC20TokenDeployedEventArgs {
  name: string;
  symbol: string;
  cap: string;
  contractTemplate: string;
}

export interface IContractManagerERC20TokenDeployedEvent {
  account: string;
  externalId: number;
  args: IERC20TokenDeployedEventArgs;
}
