import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { Contract, BigNumber } from "ethers";
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
    console.log("rule", rule);
    let override;
    if (rule.deposit.tokenType === TokenType.NATIVE || rule.deposit.tokenType === TokenType.ERC20) {
      override = { value: BigNumber.from(rule.deposit.amount) };
      console.log("override", override);
      console.log("rule.ruleId", rule.ruleId);
      console.log("rule.deposit.tokenId", rule.deposit.tokenId);
    }
    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, library.getSigner());
    return contract.deposit(rule.ruleId, rule.deposit.tokenId || 0, override) as Promise<void>;
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
