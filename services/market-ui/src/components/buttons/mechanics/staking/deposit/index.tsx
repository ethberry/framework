import { FC } from "react";

import { ListActionVariant } from "@framework/mui-lists";
import { IStakingRule, TokenType } from "@framework/types";

import { StakingDepositComplexButton } from "../deposit-complex";
import { StakingDepositSimpleButton } from "../deposit-simple";

export interface IStakingDepositButtonProps {
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}

// TODO deposit array
export const StakingDepositButton: FC<IStakingDepositButtonProps> = props => {
  const { disabled, rule, variant } = props;

  if (rule.deposit?.components.some(e => e.tokenType === TokenType.ERC721 || e.tokenType === TokenType.ERC998)) {
    return <StakingDepositComplexButton rule={rule} disabled={disabled} variant={variant} />;
  }

  return <StakingDepositSimpleButton rule={rule} disabled={disabled} variant={variant} />;
};
