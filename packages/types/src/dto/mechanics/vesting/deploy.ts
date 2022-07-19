import { VestingTemplate } from "../../../entities";

export interface IVestingDeployDto {
  contractTemplate: VestingTemplate;
  account: string;
  startTimestamp: string;
  duration: number;
}
