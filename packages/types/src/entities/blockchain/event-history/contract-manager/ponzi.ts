import { IContractManagerCommonDeployedEvent } from "./common";

export interface IPonziDeployedEventArgs {
  payees: Array<string>;
  shares: Array<string>;
  contractTemplate: string;
}

export interface IContractManagerPonziDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IPonziDeployedEventArgs;
}
