import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { ILotteryTicket, TokenStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import GetPrizeABI from "./getPrize.abi.json";

export interface ILotteryRewardButtonProps {
  ticket: ILotteryTicket;
}

export const LotteryRewardButton: FC<ILotteryRewardButtonProps> = props => {
  const { ticket } = props;

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((ticket: ILotteryTicket, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.LOTTERY_ADDR, GetPrizeABI, web3Context.provider?.getSigner());
    return contract.getPrize(ticket.token?.tokenId) as Promise<void>;
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
        disabled={ticket.token!.tokenStatus !== TokenStatus.MINTED}
        data-testid="LotteryRewardButton"
      >
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
