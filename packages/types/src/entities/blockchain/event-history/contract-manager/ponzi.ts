export interface IPonziDeployedEventArgs {
  payees: Array<string>;
  shares: Array<string>;
  contractTemplate: string;
}

export interface IContractManagerPonziDeployedEvent {
  account: string;
  externalId: number;
  args: IPonziDeployedEventArgs;
}
