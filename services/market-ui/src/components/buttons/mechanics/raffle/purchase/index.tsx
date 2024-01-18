import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Casino } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useAppSelector } from "@gemunion/redux";
import { getEthPrice } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IRaffleRound } from "@framework/types";
import { TokenType } from "@framework/types";

import RafflePurchaseABI from "@framework/abis/purchaseRaffle/ExchangeRaffleFacet.json";

export interface IRafflePurchaseButtonProps {
  className?: string;
  disabled?: boolean;
  round: Partial<IRaffleRound>;
  variant?: ListActionVariant;
}

export const RafflePurchaseButton: FC<IRafflePurchaseButtonProps> = props => {
  const { className, disabled, round, variant = ListActionVariant.button } = props;

  const { referrer } = useAppSelector(state => state.settings);

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, RafflePurchaseABI, web3Context.provider?.getSigner());

      return contract.purchaseRaffle(
        {
          externalId: round.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: round.contract?.address,
          referrer,
        },
        {
          tokenType: 2,
          token: round.ticketContract?.address,
          tokenId: "0",
          amount: "1",
        },
        round.price?.components.map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract?.address,
          tokenId: component.template?.tokens![0].tokenId,
          amount: component.amount,
        }))[0],
        sign.signature,
        {
          value: getEthPrice(round.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/raffle/ticket/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer,
          contractId: round.contractId,
        },
      },
      null,
      web3Context,
    ) as Promise<void>;
  });

  const handlePurchase = () => {
    return metaFn();
  };

  return (
    <ListAction
      onClick={handlePurchase}
      icon={Casino}
      message="form.buttons.buy"
      buttonVariant="contained"
      className={className}
      dataTestId="RafflePurchaseButton"
      disabled={
        disabled ||
        !round?.roundId ||
        (!!round.maxTickets && round.maxTickets > 0 && round.maxTickets <= round.ticketCount!)
      }
      variant={variant}
    />
  );
};
