import { FC } from "react";
import { StopCircleOutlined } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import LotteryEndRoundABI from "../../../../../../abis/mechanics/lottery/round/end/endRound.abi.json";

import { ListAction, ListActionVariant } from "../../../../../common/lists";

export interface ILotteryRoundEndMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const LotteryRoundEndMenuItem: FC<ILotteryRoundEndMenuItemProps> = props => {
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
      dataTestId="LotteryRoundEndButton"
      icon={StopCircleOutlined}
      message="pages.lottery.rounds.end"
      disabled={disabled}
      variant={variant}
    />
  );
};
