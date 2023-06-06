import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IRaffleTicket, TokenStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import RaffleGetPrizeABI from "../../../../../abis/mechanics/lottery/reward/getPrize.abi.json";

export interface IRaffleRewardButtonProps {
  ticket: IRaffleTicket;
}

export const RaffleRewardButton: FC<IRaffleRewardButtonProps> = props => {
  const { ticket } = props;

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((ticket: IRaffleTicket, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.RAFFLE_ADDR, RaffleGetPrizeABI, web3Context.provider?.getSigner());
    return contract.getPrize(ticket.token?.tokenId) as Promise<void>;
  });

  const handleReward = (ticket: IRaffleTicket): (() => Promise<void>) => {
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
        data-testid="RaffleRewardButton"
      >
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
