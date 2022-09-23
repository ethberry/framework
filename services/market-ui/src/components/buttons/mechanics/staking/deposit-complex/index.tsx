import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IStakingRule, StakingRuleStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

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
    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, web3Context.provider?.getSigner());
    return contract.deposit(rule.externalId, values.token.tokenId, {
      value: getEthPrice(rule.deposit),
    }) as Promise<void>;
  });

  const handleDeposit = () => {
    setIsDepositDialogOpen(true);
  };

  const handleDepositConfirm = (values: IStakingDepositDto) => {
    return metaFn(rule, values);
  };

  const handleDeployCancel = () => {
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
        onCancel={handleDeployCancel}
        open={isDepositDialogOpen}
        initialValues={{
          tokenId: 0,
          token: {
            tokenId: "0",
          },
          templateId: rule.deposit!.components[0].templateId,
          contractId: rule.deposit!.components[0].contractId,
        }}
      />
    </Fragment>
  );
};
