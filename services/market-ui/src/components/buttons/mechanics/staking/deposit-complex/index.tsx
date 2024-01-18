import { FC, Fragment, useState } from "react";
import { Savings } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { getEthPrice } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IStakingRule } from "@framework/types";
import { StakingRuleStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useAppSelector } from "@gemunion/redux";

import StakingDepositABI from "@framework/abis/deposit/Staking.json";

import type { IStakingDepositDto } from "./dialog";
import { StakingDepositDialog } from "./dialog";

export interface IStakingDepositComplexButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}

export const StakingDepositComplexButton: FC<IStakingDepositComplexButtonProps> = props => {
  const { className, disabled, rule, variant } = props;

  const { referrer } = useAppSelector(state => state.settings);

  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  // !!! tokenIds[] must include all deposit tokens !!!
  const metaFn = useMetamask((rule: IStakingRule, values: IStakingDepositDto, web3Context: Web3ContextType) => {
    const contract = new Contract(rule.contract!.address, StakingDepositABI, web3Context.provider?.getSigner());
    const params = {
      externalId: rule.externalId,
      expiresAt: 0,
      nonce: utils.formatBytes32String("nonce"),
      extra: utils.formatBytes32String("0x"),
      receiver: constants.AddressZero,
      referrer,
    };
    return contract.deposit(params, values.tokenIds, {
      value: getEthPrice(rule.deposit),
    }) as Promise<void>;
  });

  const handleDeposit = () => {
    setIsDepositDialogOpen(true);
  };

  const handleDepositConfirm = (values: IStakingDepositDto) => {
    return metaFn(rule, values).finally(() => {
      setIsDepositDialogOpen(false);
    });
  };

  const handleDepositCancel = () => {
    setIsDepositDialogOpen(false);
  };

  if (rule.stakingRuleStatus !== StakingRuleStatus.ACTIVE) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleDeposit}
        icon={Savings}
        message="form.tips.deposit"
        className={className}
        dataTestId="StakingDepositComplexButton"
        disabled={disabled}
        variant={variant}
      />
      <StakingDepositDialog
        onConfirm={handleDepositConfirm}
        onCancel={handleDepositCancel}
        open={isDepositDialogOpen}
        initialValues={{
          tokenIds: [0],
          deposit: rule.deposit!.components,
        }}
      />
    </Fragment>
  );
};
