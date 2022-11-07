import type { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../asset";
import { IContract } from "../../hierarchy/contract";

export enum PyramidRuleStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IPyramidRule extends ISearchable {
  contractId: number;
  contract: IContract;
  depositId: number;
  deposit?: IAsset;
  rewardId: number;
  reward?: IAsset;
  duration: number;
  penalty: number;
  pyramidRuleStatus: PyramidRuleStatus;
  externalId: string;
}
