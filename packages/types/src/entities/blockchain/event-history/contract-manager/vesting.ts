import type { IAssetItem } from "../exchange/common";

export interface IVestingDeployedEventArgs {
  owner: string;
  startTimestamp: string;
  cliffInMonth: number;
  monthlyRelease: number;
  contractTemplate: string;
}

export interface IContractManagerVestingDeployedEvent {
  account: string;
  externalId: number;
  args: IVestingDeployedEventArgs;
  items: Array<IAssetItem>;
}
