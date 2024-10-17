import type { IAssetItem } from "../exchange";
import { IContractManagerCommonDeployedEvent } from "./common";

export interface IVestingDeployedEventArgs {
  owner: string;
  startTimestamp: string;
  cliffInMonth: number;
  monthlyRelease: number;
  contractTemplate: string;
}

export interface IContractManagerVestingDeployedEvent extends IContractManagerCommonDeployedEvent {
  args: IVestingDeployedEventArgs;
  items: Array<IAssetItem>;
}
