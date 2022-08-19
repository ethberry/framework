import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IStakingStake, StakeStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

export interface IStakingRewardSimpleButtonProps {
  stake: IStakingStake;
}

export const StakingRewardSimpleButton: FC<IStakingRewardSimpleButtonProps> = props => {
  const { stake } = props;

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((stake: IStakingStake, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, web3Context.provider?.getSigner());
    return contract.receiveReward(stake.externalId, false, false) as Promise<void>;
  });

  const handleReward = (stake: IStakingStake): (() => Promise<any>) => {
    return (): Promise<any> => {
      return metaFn(stake);
    };
  };

  if (stake.stakeStatus !== StakeStatus.ACTIVE) {
    return null;
  }

  return (
    <Tooltip title={formatMessage({ id: "form.tips.reward" })}>
      <IconButton onClick={handleReward(stake)} data-testid="StakeRewardButton">
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
