import type { ISearchable } from "@gemunion/types-collection";

import { IContract } from "../../hierarchy/contract";
import { IAsset } from "../asset";
import { DurationUnit } from "../../common";

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
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  pyramidRuleStatus: PyramidRuleStatus;
  externalId: string;
}
