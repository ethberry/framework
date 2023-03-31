import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IStakingRule, StakingRuleStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingDepositABI from "../../../../../abis/components/buttons/mechanics/staking/deposit/deposit.abi.json";

import { getEthPrice } from "../../../../../utils/money";

export interface IStakingDepositSimpleButtonProps {
  rule: IStakingRule;
}

export const StakingDepositSimpleButton: FC<IStakingDepositSimpleButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const metaDeposit = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.STAKING_ADDR, StakingDepositABI, web3Context.provider?.getSigner());
    // TODO pass real tokenId of selected ERC721 or ERC998
    const params = {
      nonce: utils.formatBytes32String("nonce"),
      externalId: rule.externalId,
      expiresAt: 0,
      referrer: constants.AddressZero,
    };
    const tokenId = rule.deposit!.components[0].templateId; // for 1155
    return contract.deposit(params, [tokenId], {
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

  if (rule.stakingRuleStatus !== StakingRuleStatus.ACTIVE) {
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
