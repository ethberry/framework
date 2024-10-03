export interface IPaymentSplitterDeployedEventArgs {
  payees: Array<string>;
  shares: Array<string>;
}

export interface IContractManagerPaymentSplitterDeployedEvent {
  account: string;
  externalId: number;
  args: IPaymentSplitterDeployedEventArgs;
}
