import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import { IStakingRule, StakingStatus } from "@framework/types";
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
  const { account } = useWeb3React();

  const metaFn = useMetamask((rule: IStakingRule, values: IStakingDepositDto, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, web3Context.provider?.getSigner());
    return contract.deposit(rule.externalId, values.blockchainId, {
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

  if (rule.stakingStatus !== StakingStatus.ACTIVE) {
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
          account: account || "",
          tokenId: 0,
          blockchainId: "",
          templateId: rule.deposit!.components[0].templateId,
          contractId: rule.deposit!.components[0].contractId,
        }}
      />
    </Fragment>
  );
};
