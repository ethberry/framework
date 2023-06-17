import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { TokenStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import LotteryGetPrizeABI from "../../../../../abis/mechanics/lottery/reward/getPrize.abi.json";
import { ILotteryTicket } from "../../../../../pages/mechanics/lottery/ticket-list";

export interface ILotteryRewardButtonProps {
  ticket: ILotteryTicket;
}

export const LotteryRewardButton: FC<ILotteryRewardButtonProps> = props => {
  const { ticket } = props;

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((ticket: ILotteryTicket, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.LOTTERY_ADDR, LotteryGetPrizeABI, web3Context.provider?.getSigner());
    return contract.getPrize(ticket.tokenId) as Promise<void>;
  });

  const handleReward = (ticket: ILotteryTicket): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn(ticket).then(() => {
        // TODO reload page
      });
    };
  };

  return (
    <Tooltip title={formatMessage({ id: "form.tips.redeem" })}>
      <IconButton
        onClick={handleReward(ticket)}
        disabled={ticket.tokenStatus !== TokenStatus.MINTED}
        data-testid="LotteryRewardButton"
      >
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
