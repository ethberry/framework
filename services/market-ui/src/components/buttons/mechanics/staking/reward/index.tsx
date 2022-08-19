import { FC } from "react";

import { IStakingStake } from "@framework/types";

import { StakingRewardComplexButton } from "../reward-complex";
import { StakingRewardSimpleButton } from "../reward-simple";

export interface IStakingRewardButtonProps {
  stake: IStakingStake;
}

export const StakingRewardButton: FC<IStakingRewardButtonProps> = props => {
  const { stake } = props;

  if (stake.stakingRule?.recurrent) {
    return <StakingRewardComplexButton stake={stake} />;
  }

  return <StakingRewardSimpleButton stake={stake} />;
};
