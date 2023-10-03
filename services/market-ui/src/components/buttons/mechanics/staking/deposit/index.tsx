import { FC } from "react";

import { ListActionVariant } from "@framework/mui-lists";
import type { IStakingRule, TokenType } from "@framework/types";

import { StakingDepositComplexButton } from "../deposit-complex";
import { StakingDepositSimpleButton } from "../deposit-simple";

export interface IStakingDepositButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}

// TODO deposit array
export const StakingDepositButton: FC<IStakingDepositButtonProps> = props => {
  const { className, disabled, rule, variant } = props;

  if (rule.deposit?.components.some(e => e.tokenType === TokenType.ERC721 || e.tokenType === TokenType.ERC998)) {
    return <StakingDepositComplexButton rule={rule} className={className} disabled={disabled} variant={variant} />;
  }

  return <StakingDepositSimpleButton rule={rule} className={className} disabled={disabled} variant={variant} />;
};
