import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IStakingDeposit } from "@framework/types";
import { StakingDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingReceiveRewardABI from "../../../../../abis/mechanics/common/reward/receiveReward.abi.json";

export interface IStakingRewardSimpleButtonProps {
  className?: string;
  disabled?: boolean;
  stake: IStakingDeposit;
  variant?: ListActionVariant;
}

export const StakingRewardSimpleButton: FC<IStakingRewardSimpleButtonProps> = props => {
  const { className, disabled, stake, variant } = props;

  const metaFn = useMetamask((stake: IStakingDeposit, web3Context: Web3ContextType) => {
    const contract = new Contract(
      stake.stakingRule!.contract!.address,
      StakingReceiveRewardABI,
      web3Context.provider?.getSigner(),
    );
    return contract.receiveReward(stake.externalId, false, false) as Promise<void>;
  });

  const handleReward = (stake: IStakingDeposit): (() => Promise<any>) => {
    return (): Promise<any> => {
      return metaFn(stake);
    };
  };

  if (stake.stakingDepositStatus !== StakingDepositStatus.ACTIVE) {
    return null;
  }

  return (
    <ListAction
      onClick={handleReward(stake)}
      icon={Redeem}
      message="form.tips.reward"
      className={className}
      dataTestId="StakingRewardSimpleButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
