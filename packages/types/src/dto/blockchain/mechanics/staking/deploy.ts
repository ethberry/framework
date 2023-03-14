import { StakingContractTemplates } from "../../../../entities";

export interface IStakingContractDeployDto {
  contractTemplate: StakingContractTemplates;
  maxStake: number;
}
