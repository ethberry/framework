import { Erc20VestingTemplate } from "../../../entities";

export interface IErc20VestingDeployDto {
  contractTemplate: Erc20VestingTemplate;
  beneficiary: string;
  startTimestamp: string;
  duration: number;
}
