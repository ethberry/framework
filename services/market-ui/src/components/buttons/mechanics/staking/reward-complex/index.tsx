import { FC, Fragment, useState } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IStakingDeposit, StakingDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingReceiveRewardABI from "../../../../../abis/mechanics/common/reward/receiveReward.abi.json";

import { DepositRewardDialog, IDepositRewardDto } from "../../../../dialogs/reward-dialog";

export interface IStakingRewardComplexButtonProps {
  disabled?: boolean;
  stake: IStakingDeposit;
  variant?: ListActionVariant;
}

export const StakingRewardComplexButton: FC<IStakingRewardComplexButtonProps> = props => {
  const { disabled, stake, variant } = props;

  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);

  const metaFn = useMetamask(
    async (stake: IStakingDeposit, values: IDepositRewardDto, web3Context: Web3ContextType) => {
      const contract = new Contract(
        stake.stakingRule!.contract!.address,
        StakingReceiveRewardABI,
        web3Context.provider?.getSigner(),
      );
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
      <ListAction
        onClick={handleReward}
        icon={Redeem}
        message="form.tips.reward"
        dataTestId="StakeRewardButton"
        disabled={disabled}
        variant={variant}
      />
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
