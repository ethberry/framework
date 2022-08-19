import { FC } from "react";

import { IStakingRule, TokenType } from "@framework/types";

import { StakingDepositComplexButton } from "../deposit-complex";
import { StakingDepositSimpleButton } from "../deposit-simple";

export interface IStakingDepositButtonProps {
  rule: IStakingRule;
}

export const StakingDepositButton: FC<IStakingDepositButtonProps> = props => {
  const { rule } = props;

  if (
    rule.deposit?.components[0].tokenType === TokenType.ERC721 ||
    rule.deposit?.components[0].tokenType === TokenType.ERC998
  ) {
    return <StakingDepositComplexButton rule={rule} />;
  }

  return <StakingDepositSimpleButton rule={rule} />;
};
