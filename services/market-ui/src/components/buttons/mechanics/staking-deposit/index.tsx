import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { BigNumber, Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IStakingRule, StakingStatus, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

export interface IStakingDepositButtonProps {
  rule: IStakingRule;
}

export const StakingDepositButton: FC<IStakingDepositButtonProps> = props => {
  const { rule } = props;

  const { formatMessage } = useIntl();

  const metaDeposit = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    if (rule.stakingStatus !== StakingStatus.ACTIVE) {
      return Promise.reject(new Error(""));
    }
    let override;
    if (
      rule.deposit?.components[0].tokenType === TokenType.NATIVE ||
      rule.deposit?.components[0].tokenType === TokenType.ERC20
    ) {
      override = { value: BigNumber.from(rule.deposit.components[0].amount) };
    }
    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, web3Context.provider?.getSigner());
    return contract.deposit(rule.externalId, rule.deposit?.components[0].templateId || 0, override) as Promise<void>;
  });

  const handleDeposit = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaDeposit(rule).then(() => {
        // TODO reload page
      });
    };
  };

  if (rule.stakingStatus === StakingStatus.ACTIVE) {
    return (
      <Tooltip title={formatMessage({ id: "pages.staking-rules.deposit" })}>
        <IconButton onClick={handleDeposit(rule)} data-testid="StakeDepositButton">
          <Casino />
        </IconButton>
      </Tooltip>
    );
  } else {
    return null;
  }
};
