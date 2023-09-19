import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IPonziDeposit, PonziDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import PonziReceiveRewardABI from "../../../../../abis/mechanics/common/reward/receiveReward.abi.json";

export interface IPonziRewardButtonProps {
  className?: string;
  disabled?: boolean;
  stake: IPonziDeposit;
  variant?: ListActionVariant;
}

export const PonziRewardButton: FC<IPonziRewardButtonProps> = props => {
  const { className, disabled, stake, variant } = props;

  const metaFn = useMetamask((stake: IPonziDeposit, web3Context: Web3ContextType) => {
    const contract = new Contract(
      stake.ponziRule!.contract.address,
      PonziReceiveRewardABI,
      web3Context.provider?.getSigner(),
    );
    return contract.receiveReward(stake.externalId, false, false) as Promise<void>;
  });

  const handleReward = (stake: IPonziDeposit): (() => Promise<any>) => {
    return (): Promise<any> => {
      return metaFn(stake);
    };
  };

  if (stake.ponziDepositStatus !== PonziDepositStatus.ACTIVE) {
    return null;
  }

  return (
    <ListAction
      onClick={handleReward(stake)}
      icon={Redeem}
      message="form.tips.reward"
      className={className}
      dataTestId="StakeRewardButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
