import { FC } from "react";

import { IStakingRule, TokenType } from "@framework/types";

import { StakingDepositComplexButton } from "../deposit-complex";
import { StakingDepositSimpleButton } from "../deposit-simple";

export interface IStakingDepositButtonProps {
  rule: IStakingRule;
}

// TODO deposit array
export const StakingDepositButton: FC<IStakingDepositButtonProps> = props => {
  const { rule } = props;
  if (rule.deposit?.components.some(e => e.tokenType === TokenType.ERC721 || e.tokenType === TokenType.ERC998)) {
    return <StakingDepositComplexButton rule={rule} />;
  }

  return <StakingDepositSimpleButton rule={rule} />;
};
