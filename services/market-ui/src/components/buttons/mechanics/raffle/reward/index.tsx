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
import { ListAction, ListActionVariant } from "../../../../common/lists";

export interface IRaffleRewardButtonProps {
  disabled?: boolean;
  token: IRaffleToken;
  variant?: ListActionVariant;
}

export const RaffleRewardButton: FC<IRaffleRewardButtonProps> = props => {
  const { disabled, token, variant } = props;

  const metaFn = useMetamask((ticket: IRaffleToken, web3Context: Web3ContextType) => {
    const contract = new Contract(token.round.contract!.address, RaffleGetPrizeABI, web3Context.provider?.getSigner());
    return contract.getPrize(ticket.tokenId, token.round.roundId) as Promise<void>;
  });

  const handleReward = (ticket: IRaffleToken): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn(ticket).then(() => {
        // TODO reload page
      });
    };
  };

  if (token.metadata.PRIZE) {
    return null;
  }

  return (
    <ListAction
      onClick={handleReward(token)}
      icon={Redeem}
      message="form.tips.redeem"
      disabled={disabled}
      data-testid="RaffleRewardButton"
      variant={variant}
    />
  );
};
