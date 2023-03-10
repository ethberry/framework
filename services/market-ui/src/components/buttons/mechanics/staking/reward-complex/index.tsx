import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IStakingDeposit, StakingDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ReceiveRewardABI from "../reward/receiveReward.abi.json";
// import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

import { DepositRewardDialog, IDepositRewardDto } from "../../../../dialogs/reward-dialog";

export interface IStakingRewardComplexButtonProps {
  stake: IStakingDeposit;
}

export const StakingRewardComplexButton: FC<IStakingRewardComplexButtonProps> = props => {
  const { stake } = props;

  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn = useMetamask(
    async (stake: IStakingDeposit, values: IDepositRewardDto, web3Context: Web3ContextType) => {
      const contract = new Contract(process.env.STAKING_ADDR, ReceiveRewardABI, web3Context.provider?.getSigner());
      // https://ethereum.stackexchange.com/questions/132850/incorrect-gaslimit-estimation-for-transaction
      const estGas = await contract.estimateGas.receiveReward(
        stake.externalId,
        values.withdrawDeposit,
        values.breakLastPeriod,
      );
      return contract.receiveReward(stake.externalId, values.withdrawDeposit, values.breakLastPeriod, {
        gasLimit: estGas.add(estGas.div(100).mul(10)),
      }) as Promise<void>;
    },
  );

  const handleReward = () => {
    setIsRewardDialogOpen(true);
  };

  const handleRewardConfirm = (values: IDepositRewardDto) => {
    return metaFn(stake, values);
  };

  const handleRewardCancel = () => {
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
      <DepositRewardDialog
        onConfirm={handleRewardConfirm}
        onCancel={handleRewardCancel}
        open={isRewardDialogOpen}
        initialValues={{
          rule: stake.stakingRule!,
          withdrawDeposit: false,
          breakLastPeriod: false,
        }}
      />
    </Fragment>
  );
};
