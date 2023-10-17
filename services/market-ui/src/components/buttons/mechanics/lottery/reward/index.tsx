import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { ILotteryToken } from "@framework/types";

import LotteryGetPrizeABI from "../../../../../abis/mechanics/lottery/reward/getPrize.abi.json";

import { decodeNumbersToArr, getWinners } from "../../../../../pages/mechanics/lottery/token-list/utils";

export interface ILotteryRewardButtonProps {
  className?: string;
  disabled?: boolean;
  token: ILotteryToken;
  variant?: ListActionVariant;
}

export const LotteryRewardButton: FC<ILotteryRewardButtonProps> = props => {
  const { className, disabled, token, variant } = props;

  const metaFn = useMetamask((ticket: ILotteryToken, web3Context: Web3ContextType) => {
    const contract = new Contract(token.round.contract!.address, LotteryGetPrizeABI, web3Context.provider?.getSigner());
    return contract.getPrize(ticket.tokenId, token.round.roundId) as Promise<void>;
  });

  const handleReward = (ticket: ILotteryToken): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn(ticket).then(() => {
        // TODO reload page
      });
    };
  };

  const count = getWinners(decodeNumbersToArr(token.metadata.NUMBERS), token.round.numbers || []);
  if (token.metadata.PRIZE === "1") {
    return null;
  }

  return (
    <ListAction
      onClick={handleReward(token)}
      icon={Redeem}
      message="form.tips.redeem"
      className={className}
      dataTestId="LotteryRewardButton"
      disabled={disabled || count === ""}
      variant={variant}
    />
  );
};
