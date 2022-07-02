import { VestingTemplate } from "../../../entities";

export interface IVestingDeployDto {
  contractTemplate: VestingTemplate;
  beneficiary: string;
  startTimestamp: string;
  duration: number;
}
