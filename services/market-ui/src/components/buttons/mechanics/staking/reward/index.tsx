import { FC } from "react";

import { IStakingDeposit } from "@framework/types";

import { StakingRewardComplexButton } from "../reward-complex";

// import { StakingRewardSimpleButton } from "../reward-simple";

export interface IStakingRewardButtonProps {
  stake: IStakingDeposit;
}

export const StakingRewardButton: FC<IStakingRewardButtonProps> = props => {
  const { stake } = props;

  if (stake.stakingRule?.recurrent) {
    return <StakingRewardComplexButton stake={stake} />;
  }

  // return <StakingRewardSimpleButton stake={stake} />;
  return <StakingRewardComplexButton stake={stake} />;
};
