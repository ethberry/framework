import { FC } from "react";
import { StopCircleOutlined } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import endRoundLotteryRandomABI from "@framework/abis/endRound/LotteryRandom.json";

export interface IRaffleRoundEndButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RaffleRoundEndButton: FC<IRaffleRoundEndButtonProps> = props => {
  const {
    className,
    contract: { address, parameters },
    disabled,
    variant,
  } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, endRoundLotteryRandomABI, web3Context.provider?.getSigner());
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
      message="pages.raffle.rounds.end"
      className={className}
      dataTestId="RaffleRoundEndButton"
      disabled={disabled || !parameters.vrfSubId || !parameters.isConsumer}
      variant={variant}
    />
  );
};
