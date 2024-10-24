import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Casino } from "@mui/icons-material";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@ethberry/types-blockchain";
import { useAllowance, useMetamask, useServerSignature } from "@ethberry/react-hooks-eth";
import { useAppSelector } from "@ethberry/redux";
import { walletSelectors } from "@ethberry/provider-wallet";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  getEthPrice,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IRaffleRound } from "@framework/types";

import ExchangeRaffleFacetPurchaseRaffleABI from "@framework/abis/json/ExchangeRaffleFacet/purchaseRaffle.json";

export interface IRafflePurchaseButtonProps {
  className?: string;
  disabled?: boolean;
  round: Partial<IRaffleRound>;
  variant?: ListActionVariant;
}

export const RafflePurchaseButton: FC<IRafflePurchaseButtonProps> = props => {
  const { className, disabled, round, variant = ListActionVariant.button } = props;

  const referrer = useAppSelector(walletSelectors.referrerSelector);

  const metaFnWitnAllowance = useAllowance(
    (web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangeRaffleFacetPurchaseRaffleABI,
        web3Context.provider?.getSigner(),
      );

      const price = convertDatabaseAssetToChainAsset(round.price!.components);

      return contract.purchaseRaffle(
        {
          externalId: round.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: constants.HashZero,
          receiver: round.contract?.address,
          referrer,
        },
        {
          tokenType: 2,
          token: round.ticketContract?.address,
          tokenId: "0",
          amount: "1",
        },
        price[0],
        sign.signature,
        {
          value: getEthPrice(round.price),
        },
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const price = convertDatabaseAssetToTokenTypeAsset(round.price!.components);
      return metaFnWitnAllowance(
        {
          contract: systemContract.address,
          assets: price,
        },
        web3Context,
        sign,
        systemContract,
      );
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/raffle/ticket/sign",
        method: "POST",
        data: {
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
