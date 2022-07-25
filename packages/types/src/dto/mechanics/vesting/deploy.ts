import { VestingContractTemplate } from "../../../entities";

export interface IVestingDeployDto {
  contractTemplate: VestingContractTemplate;
  account: string;
  startTimestamp: string;
  duration: number;
}
