import { FC, Fragment, useState } from "react";
import { Savings } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IStakingRule, StakingRuleStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingDepositABI from "../../../../../abis/mechanics/staking/deposit/deposit.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { IStakingDepositDto, StakingDepositDialog } from "./dialog";

export interface IStakingDepositComplexButtonProps {
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}

export const StakingDepositComplexButton: FC<IStakingDepositComplexButtonProps> = props => {
  const { disabled, rule, variant } = props;

  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  const metaFn = useMetamask((rule: IStakingRule, values: IStakingDepositDto, web3Context: Web3ContextType) => {
    const contract = new Contract(rule.contract!.address, StakingDepositABI, web3Context.provider?.getSigner());
    const params = {
      externalId: rule.externalId,
      expiresAt: 0,
      nonce: utils.formatBytes32String("nonce"),
      extra: utils.formatBytes32String("0x"),
      receiver: constants.AddressZero,
      referrer: constants.AddressZero,
    };
    return contract.deposit(params, values.tokenIds, {
      value: getEthPrice(rule.deposit),
    }) as Promise<void>;
  });

  const handleDeposit = () => {
    setIsDepositDialogOpen(true);
  };

  const handleDepositConfirm = (values: IStakingDepositDto) => {
    return metaFn(rule, values);
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
        dataTestId="StakeDepositComplexButton"
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
