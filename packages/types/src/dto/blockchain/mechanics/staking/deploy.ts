import { StakingContractFeatures } from "../../../../entities";

export interface IStakingDeployDto {
  contractFeatures: Array<StakingContractFeatures>;
  maxStake: number;
}
