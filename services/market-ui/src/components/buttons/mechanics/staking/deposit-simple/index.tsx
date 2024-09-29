import { FC } from "react";
import { Savings } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { convertDatabaseAssetToTokenTypeAsset, getEthPrice } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import { StakingRuleStatus } from "@framework/types";
import type { IStakingRule } from "@framework/types";
import { useAllowance, useMetamask } from "@ethberry/react-hooks-eth";

import StakingDepositABI from "@framework/abis/json/Staking/deposit.json";

export interface IStakingDepositSimpleButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}

export const StakingDepositSimpleButton: FC<IStakingDepositSimpleButtonProps> = props => {
  const { className, disabled, rule, variant } = props;

  const metaFnWithAllowance = useAllowance((web3Context: Web3ContextType, rule: IStakingRule) => {
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

  const metaDeposit = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    const price = convertDatabaseAssetToTokenTypeAsset(rule.deposit?.components);
    return metaFnWithAllowance(
      {
        contract: rule.contract!.address,
        assets: [price[0]],
      },
      web3Context,
      rule,
    );
  });

  const handleDeposit = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaDeposit(rule);
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
      dataTestId="StakingDepositSimpleButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
