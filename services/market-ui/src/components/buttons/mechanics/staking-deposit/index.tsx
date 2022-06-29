import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { BigNumber, Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { IStaking, StakingStatus, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Staking/UniStaking.sol/UniStaking.json";

export interface IStakingDepositButtonProps {
  rule: IStaking;
}

export const StakingDepositButton: FC<IStakingDepositButtonProps> = props => {
  const { rule } = props;

  const { formatMessage } = useIntl();

  const { library } = useWeb3React();

  const metaDeposit = useMetamask((rule: IStaking) => {
    if (rule.stakingStatus !== StakingStatus.ACTIVE) {
      return Promise.reject(new Error(""));
    }
    let override;
    if (
      rule.deposit.components[0].tokenType === TokenType.NATIVE ||
      rule.deposit.components[0].tokenType === TokenType.ERC20
    ) {
      override = { value: BigNumber.from(rule.deposit.components[0].amount) };
    }
    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, library.getSigner());
    return contract.deposit(rule.ruleId, rule.deposit.components[0].uniTokenId || 0, override) as Promise<void>;
  });

  const handleDeposit = (rule: IStaking): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaDeposit(rule).then(() => {
        // TODO reload page
      });
    };
  };

  if (rule.stakingStatus === StakingStatus.ACTIVE) {
    return (
      <Tooltip title={formatMessage({ id: "pages.staking.deposit" })}>
        <IconButton onClick={handleDeposit(rule)} data-testid="StakeDepositButton">
          <Casino />
        </IconButton>
      </Tooltip>
    );
  } else {
    return null;
  }
};
