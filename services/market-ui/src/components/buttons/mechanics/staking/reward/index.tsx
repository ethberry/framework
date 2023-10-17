import { FC } from "react";

import { ListActionVariant } from "@framework/mui-lists";
import type { IStakingDeposit } from "@framework/types";

import { StakingRewardComplexButton } from "../reward-complex";
import { StakingRewardSimpleButton } from "../reward-simple";

export interface IStakingRewardButtonProps {
  className?: string;
  disabled?: boolean;
  stake: IStakingDeposit;
  variant?: ListActionVariant;
}

export const StakingRewardButton: FC<IStakingRewardButtonProps> = props => {
  const { className, disabled, stake, variant } = props;

  if (stake.stakingRule?.recurrent) {
    return <StakingRewardComplexButton stake={stake} className={className} disabled={disabled} variant={variant} />;
  }

  return <StakingRewardSimpleButton stake={stake} className={className} disabled={disabled} variant={variant} />;
};
