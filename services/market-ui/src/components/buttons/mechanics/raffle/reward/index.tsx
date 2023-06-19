import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { ITicketRaffle, TokenStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import RaffleGetPrizeABI from "../../../../../abis/mechanics/lottery/reward/getPrize.abi.json";

export interface IRaffleRewardButtonProps {
  ticket: ITicketRaffle;
}

export const RaffleRewardButton: FC<IRaffleRewardButtonProps> = props => {
  const { ticket } = props;

  const { formatMessage } = useIntl();

  // TODO get raffle.add from round
  const metaFn = useMetamask((ticket: ITicketRaffle, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.RAFFLE_ADDR, RaffleGetPrizeABI, web3Context.provider?.getSigner());
    return contract.getPrize(ticket.tokenId) as Promise<void>;
  });

  const handleReward = (ticket: ITicketRaffle): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn(ticket).then(() => {
        // TODO reload page
      });
    };
  };

  if (ticket.metadata.PRIZE === "1") {
    return null;
  }

  return (
    <Tooltip title={formatMessage({ id: "form.tips.redeem" })}>
      <IconButton
        onClick={handleReward(ticket)}
        disabled={
          ticket.tokenStatus !== TokenStatus.MINTED ||
          ticket.metadata.PRIZE === "1" ||
          ticket.tokenId !== ticket.round.number
        }
        data-testid="RaffleRewardButton"
      >
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
