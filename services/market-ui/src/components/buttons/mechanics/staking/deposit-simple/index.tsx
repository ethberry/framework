import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IStakingRule, StakingStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";
import { getEthPrice } from "../../../../../utils/money";

export interface IStakingDepositSimpleButtonProps {
  rule: IStakingRule;
}

export const StakingDepositSimpleButton: FC<IStakingDepositSimpleButtonProps> = props => {
  const { rule } = props;

  const { formatMessage } = useIntl();

  const metaDeposit = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, web3Context.provider?.getSigner());
    // TODO pass real tokenId of selected ERC721 or ERC998
    // const tokenId = 0;
    const tokenId = rule.deposit!.components[0].templateId; // for 1155
    return contract.deposit(rule.externalId, tokenId, {
      value: getEthPrice(rule.deposit),
    }) as Promise<void>;
  });

  const handleDeposit = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaDeposit(rule).then(() => {
        // TODO reload page
      });
    };
  };

  if (rule.stakingStatus !== StakingStatus.ACTIVE) {
    return null;
  }

  return (
    <Tooltip title={formatMessage({ id: "form.tips.deposit" })}>
      <IconButton onClick={handleDeposit(rule)} data-testid="StakeDepositSimpleButton">
        <Savings />
      </IconButton>
    </Tooltip>
  );
};
