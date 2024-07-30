import { FC, Fragment, useState } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IStakingDeposit } from "@framework/types";
import { StakingDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingReceiveRewardABI from "@framework/abis/json/Staking/receiveReward.json";
import { DepositRewardDialog, IDepositRewardDto } from "../../../../dialogs/reward-dialog";

export interface IStakingRewardSimpleButtonProps {
  className?: string;
  disabled?: boolean;
  stake: IStakingDeposit;
  variant?: ListActionVariant;
}

export const StakingRewardSimpleButton: FC<IStakingRewardSimpleButtonProps> = props => {
  const { className, disabled, stake, variant } = props;

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
      // return contract.receiveReward(stake.externalId, false, false) as Promise<void>;
      return contract.receiveReward(stake.externalId, values.withdrawDeposit, values.breakLastPeriod, {
        gasLimit: estGas.add(estGas.div(100).mul(10)),
      }) as Promise<void>;
    },
  );

  // const handleRewardStake = (stake: IStakingDeposit): (() => Promise<any>) => {
  //   return (): Promise<any> => {
  //     return metaFn(stake);
  //   };
  // };

  const handleRewardConfirm = (values: IDepositRewardDto) => {
    return metaFn(stake, values).finally(() => {
      setIsRewardDialogOpen(false);
    });
  };

  if (stake.stakingDepositStatus !== StakingDepositStatus.ACTIVE) {
    return null;
  }

  const handleReward = () => {
    setIsRewardDialogOpen(true);
  };

  const handleRewardCancel = () => {
    setIsRewardDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        // onClick={handleRewardStake(stake)}
        onClick={handleReward}
        icon={Redeem}
        message="form.tips.reward"
        className={className}
        dataTestId="StakingRewardSimpleButton"
        disabled={disabled}
        variant={variant}
      />
      <DepositRewardDialog
        // onConfirm={handleRewardStake(stake)}
        onConfirm={handleRewardConfirm}
        onCancel={handleRewardCancel}
        open={isRewardDialogOpen}
        initialValues={{
          rule: stake.stakingRule!,
          startTimeStamp: stake.startTimestamp,
          withdrawDeposit: false,
          breakLastPeriod: false,
        }}
      />
    </Fragment>
  );
};
