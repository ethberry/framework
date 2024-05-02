import { FC } from "react";
import { StopCircleOutlined } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";

import LotteryEndRoundABI from "@framework/abis/endRound/LotteryRandom.json";
import { shouldDisableByContractType } from "../../../../utils";

export interface ILotteryRoundEndButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const LotteryRoundEndButton: FC<ILotteryRoundEndButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, parameters },
    disabled,
    variant,
  } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, LotteryEndRoundABI, web3Context.provider?.getSigner());
    return contract.endRound() as Promise<void>;
  });

  const handleEndRound = () => {
    return metaFn();
  };

  // round not started
  if (!parameters.roundId) {
    return null;
  }

  return (
    <ListAction
      onClick={handleEndRound}
      icon={StopCircleOutlined}
      message="pages.lottery.rounds.end"
      className={className}
      dataTestId="LotteryRoundEndButton"
      disabled={disabled || shouldDisableByContractType(contract) || !parameters.vrfSubId || !parameters.isConsumer}
      variant={variant}
    />
  );
};
