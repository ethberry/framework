import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Casino } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useAppSelector } from "@gemunion/redux";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  getEthPrice,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import { bool36ArrayToByte32 } from "@gemunion/traits-v5";
import type { IContract, ILotteryRound } from "@framework/types";

import LotteryPurchaseABI from "@framework/abis/purchaseLottery/ExchangeLotteryFacet.json";
import { useAllowance } from "../../../../../utils/use-allowance";

export interface ILotteryPurchaseButtonProps {
  className?: string;
  clearForm: () => void;
  disabled?: boolean;
  round: Partial<ILotteryRound>;
  ticketNumbers: Array<boolean>;
  variant?: ListActionVariant;
}

export const LotteryPurchaseButton: FC<ILotteryPurchaseButtonProps> = props => {
  const { clearForm, ticketNumbers, round, disabled, className, variant = ListActionVariant.button } = props;
  const { referrer } = useAppSelector(state => state.settings);

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, LotteryPurchaseABI, web3Context.provider?.getSigner());

      const price = convertDatabaseAssetToChainAsset(round.price?.components);

      return contract
        .purchaseLottery(
          {
            externalId: round.id,
            expiresAt: sign.expiresAt,
            nonce: utils.arrayify(sign.nonce),
            extra: bool36ArrayToByte32(ticketNumbers),
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
        )
        .then(clearForm) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const price = convertDatabaseAssetToTokenTypeAsset(round.price?.components);

      return metaFnWithAllowance(
        { contract: systemContract.address, assets: price },
        web3Context,
        sign,
        systemContract,
      );
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/lottery/ticket/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer,
          ticketNumbers: bool36ArrayToByte32(ticketNumbers),
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
      dataTestId="LotteryPurchaseButton"
      disabled={
        disabled ||
        !round?.roundId ||
        // @ts-ignore
        (!!round.maxTickets && round.maxTickets > 0 && round.maxTickets <= round.ticketCount)
      }
      variant={variant}
    />
  );
};
