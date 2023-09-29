import { FC } from "react";
import { Savings } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IStakingRule, StakingRuleStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingDepositABI from "../../../../../abis/mechanics/staking/deposit/deposit.abi.json";

import { getEthPrice } from "../../../../../utils/money";

export interface IStakingDepositSimpleButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}

export const StakingDepositSimpleButton: FC<IStakingDepositSimpleButtonProps> = props => {
  const { className, disabled, rule, variant } = props;

  const metaDeposit = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    const contract = new Contract(rule.contract!.address, StakingDepositABI, web3Context.provider?.getSigner());

    const params = {
      externalId: rule.externalId,
      expiresAt: 0,
      nonce: utils.formatBytes32String("nonce"),
      extra: utils.formatBytes32String("0x"),
      receiver: constants.AddressZero,
      referrer: constants.AddressZero,
    };
    const tokenId = rule.deposit!.components[0].templateId;

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
    <ListAction
      onClick={handleDeposit(rule)}
      icon={Savings}
      message="form.tips.deposit"
      className={className}
      dataTestId="StakeDepositSimpleButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
