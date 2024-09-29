import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import { TokenStatus } from "@framework/types";
import type { IRaffleToken } from "@framework/types";

import RaffleGetPrizeABI from "@framework/abis/json/LotteryRandom/getPrize.json";

export interface IRaffleRewardButtonProps {
  className?: string;
  disabled?: boolean;
  token: IRaffleToken;
  variant?: ListActionVariant;
}

export const RaffleRewardButton: FC<IRaffleRewardButtonProps> = props => {
  const { className, disabled, token, variant } = props;

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
      className={className}
      disabled={disabled || token.tokenStatus !== TokenStatus.MINTED || token.tokenId !== token.round.number}
      data-testid="RaffleRewardButton"
      variant={variant}
    />
  );
};
