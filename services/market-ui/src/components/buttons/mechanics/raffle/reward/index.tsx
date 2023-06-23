import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IRaffleToken } from "@framework/types";
import { TokenStatus } from "@framework/types";

import RaffleGetPrizeABI from "../../../../../abis/mechanics/raffle/reward/getPrize.abi.json";

export interface IRaffleRewardButtonProps {
  token: IRaffleToken;
}

export const RaffleRewardButton: FC<IRaffleRewardButtonProps> = props => {
  const { token } = props;

  const { formatMessage } = useIntl();

  // TODO get raffle.add from round
  const metaFn = useMetamask((ticket: IRaffleToken, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.RAFFLE_ADDR, RaffleGetPrizeABI, web3Context.provider?.getSigner());
    return contract.getPrize(ticket.tokenId) as Promise<void>;
  });

  const handleReward = (ticket: IRaffleToken): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn(ticket).then(() => {
        // TODO reload page
      });
    };
  };

  if (token.metadata.PRIZE === "1") {
    return null;
  }

  return (
    <Tooltip title={formatMessage({ id: "form.tips.redeem" })}>
      <IconButton
        onClick={handleReward(token)}
        disabled={
          token.tokenStatus !== TokenStatus.MINTED ||
          token.metadata.PRIZE === "1" ||
          token.tokenId !== token.round.number
        }
        data-testid="RaffleRewardButton"
      >
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
