import { IContractManagerCommonDeployedEvent } from "./common";

export interface IPaymentSplitterDeployedEventArgs {
  payees: Array<string>;
  shares: Array<string>;
}

export interface IContractManagerPaymentSplitterDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IPaymentSplitterDeployedEventArgs;
}
