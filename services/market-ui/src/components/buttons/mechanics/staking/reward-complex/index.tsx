import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IStakingDeposit, StakingDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

import { IStakingRewardDto, StakingRewardDialog } from "./dialog";

export interface IStakingRewardComplexButtonProps {
  stake: IStakingDeposit;
}

export const StakingRewardComplexButton: FC<IStakingRewardComplexButtonProps> = props => {
  const { stake } = props;

  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((stake: IStakingDeposit, values: IStakingRewardDto, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, web3Context.provider?.getSigner());
    return contract.receiveReward(stake.externalId, values.withdrawDeposit, values.breakLastPeriod) as Promise<void>;
  });

  const handleReward = () => {
    setIsRewardDialogOpen(true);
  };

  const handleRewardConfirm = (values: IStakingRewardDto) => {
    return metaFn(stake, values);
  };

  const handleDeployCancel = () => {
    setIsRewardDialogOpen(false);
  };

  if (stake.stakingDepositStatus !== StakingDepositStatus.ACTIVE) {
    return null;
  }

  return (
    <Fragment>
      <Tooltip title={formatMessage({ id: "form.tips.reward" })}>
        <IconButton onClick={handleReward} data-testid="StakeRewardButton">
          <Redeem />
        </IconButton>
      </Tooltip>
      <StakingRewardDialog
        onConfirm={handleRewardConfirm}
        onCancel={handleDeployCancel}
        open={isRewardDialogOpen}
        initialValues={{
          withdrawDeposit: false,
          breakLastPeriod: false,
        }}
      />
    </Fragment>
  );
};
