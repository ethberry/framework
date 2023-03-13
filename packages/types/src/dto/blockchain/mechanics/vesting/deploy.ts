import { VestingContractTemplate } from "../../../../entities";

export interface IVestingContractDeployDto {
  contractTemplate: VestingContractTemplate;
  account: string;
  startTimestamp: string;
  duration: number;
}
