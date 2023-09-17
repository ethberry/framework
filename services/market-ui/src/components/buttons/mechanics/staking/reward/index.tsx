import { FC } from "react";

import { IStakingDeposit } from "@framework/types";

import { StakingRewardComplexButton } from "../reward-complex";

import { StakingRewardSimpleButton } from "../reward-simple";
import { ListActionVariant } from "../../../../common/lists";

export interface IStakingRewardButtonProps {
  disabled?: boolean;
  stake: IStakingDeposit;
  variant?: ListActionVariant;
}

export const StakingRewardButton: FC<IStakingRewardButtonProps> = props => {
  const { disabled, stake, variant } = props;

  if (stake.stakingRule?.recurrent) {
    return <StakingRewardComplexButton stake={stake} disabled={disabled} variant={variant} />;
  }

  return <StakingRewardSimpleButton stake={stake} disabled={disabled} variant={variant} />;
};
