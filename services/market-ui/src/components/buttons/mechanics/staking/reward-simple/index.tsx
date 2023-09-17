import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { IStakingDeposit, StakingDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingReceiveRewardABI from "../../../../../abis/mechanics/common/reward/receiveReward.abi.json";

import { ListAction, ListActionVariant } from "../../../../common/lists";

export interface IStakingRewardSimpleButtonProps {
  disabled?: boolean;
  stake: IStakingDeposit;
  variant?: ListActionVariant;
}

export const StakingRewardSimpleButton: FC<IStakingRewardSimpleButtonProps> = props => {
  const { disabled, stake, variant } = props;

  const metaFn = useMetamask((stake: IStakingDeposit, web3Context: Web3ContextType) => {
    // const contract = new Contract(process.env.STAKING_ADDR, StakingReceiveRewardABI, web3Context.provider?.getSigner());
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
      dataTestId="StakeRewardButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
