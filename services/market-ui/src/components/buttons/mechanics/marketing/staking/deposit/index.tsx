import { FC } from "react";

import { ListActionVariant } from "@framework/styled";
import type { IStakingRule } from "@framework/types";

import { StakingDepositComplexButton } from "../deposit-complex";

export interface IStakingDepositButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}

// TODO deposit array
export const StakingDepositButton: FC<IStakingDepositButtonProps> = props => {
  const { className, disabled, rule, variant } = props;

  return <StakingDepositComplexButton rule={rule} className={className} disabled={disabled} variant={variant} />;
};
