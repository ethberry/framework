import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { ILotteryToken } from "@framework/types";
import { TokenStatus } from "@framework/types";

import LotteryGetPrizeABI from "../../../../../abis/mechanics/lottery/reward/getPrize.abi.json";
import { decodeNumbersToArr, getWinners } from "../../../../../pages/mechanics/lottery/token-list/utils";

export interface ILotteryRewardButtonProps {
  token: ILotteryToken;
}

export const LotteryRewardButton: FC<ILotteryRewardButtonProps> = props => {
  const { token } = props;

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((ticket: ILotteryToken, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.LOTTERY_ADDR, LotteryGetPrizeABI, web3Context.provider?.getSigner());
    return contract.getPrize(ticket.tokenId) as Promise<void>;
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
    <Tooltip title={formatMessage({ id: "form.tips.redeem" })}>
      <IconButton
        onClick={handleReward(token)}
        disabled={token.tokenStatus !== TokenStatus.MINTED || token.metadata.PRIZE === "1" || count === ""}
        data-testid="LotteryRewardButton"
      >
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
