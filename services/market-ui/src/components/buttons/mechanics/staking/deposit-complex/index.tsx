import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Contract, utils, constants } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IStakingRule, StakingRuleStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingDepositABI from "../../../../../abis/components/buttons/mechanics/staking/deposit/deposit.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { IStakingDepositDto, StakingDepositDialog } from "./dialog";

export interface IStakingDepositComplexButtonProps {
  rule: IStakingRule;
}

export const StakingDepositComplexButton: FC<IStakingDepositComplexButtonProps> = props => {
  const { rule } = props;

  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((rule: IStakingRule, values: IStakingDepositDto, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.STAKING_ADDR, StakingDepositABI, web3Context.provider?.getSigner());
    const params = {
      nonce: utils.formatBytes32String("nonce"),
      externalId: rule.externalId,
      expiresAt: 0,
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
      <Tooltip title={formatMessage({ id: "form.tips.deposit" })}>
        <IconButton onClick={handleDeposit} data-testid="StakeDepositComplexButton">
          <Savings />
        </IconButton>
      </Tooltip>
      <StakingDepositDialog
        onConfirm={handleDepositConfirm}
        onCancel={handleDepositCancel}
        open={isDepositDialogOpen}
        initialValues={{
          // tokenId: 0,
          tokenIds: [0],
          // token: {
          //   tokenId: "0",
          // },
          // templateId: rule.deposit!.components[0].templateId,
          // contractId: rule.deposit!.components[0].contractId,
          deposit: rule.deposit!.components,
        }}
      />
    </Fragment>
  );
};
