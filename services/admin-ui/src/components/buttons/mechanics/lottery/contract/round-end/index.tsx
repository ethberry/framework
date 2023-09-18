import { FC } from "react";
import { StopCircleOutlined } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";

import LotteryEndRoundABI from "../../../../../../abis/mechanics/lottery/round/end/endRound.abi.json";

export interface ILotteryRoundEndButtonProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const LotteryRoundEndButton: FC<ILotteryRoundEndButtonProps> = props => {
  const {
    contract: { address },
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

  return (
    <ListAction
      onClick={handleEndRound}
      icon={StopCircleOutlined}
      message="pages.lottery.rounds.end"
      dataTestId="LotteryRoundEndButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
