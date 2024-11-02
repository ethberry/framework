import { LegacyVestingContractTemplates } from "../../../../../entities";

export interface ILegacyVestingContractDeployDto {
  owner: string;
  startTimestamp: string;
  cliffInMonth: number;
  monthlyRelease: number;
  contractTemplate: LegacyVestingContractTemplates;
}
