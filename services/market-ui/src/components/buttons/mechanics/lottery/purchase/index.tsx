import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Casino } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract, ILotteryRound } from "@framework/types";
import { TokenType } from "@framework/types";

import LotteryPurchaseABI from "../../../../../abis/mechanics/lottery/purchase/purchase.abi.json";
import { getEthPrice } from "../../../../../utils/money";
import { bool36ArrayToByte32 } from "@framework/traits-ui";

export interface ILotteryPurchaseButtonProps {
  className?: string;
  clearForm: () => void;
  disabled: boolean;
  round: Partial<ILotteryRound>;
  ticketNumbers: Array<boolean>;
  variant?: ListActionVariant;
}

export const LotteryPurchaseButton: FC<ILotteryPurchaseButtonProps> = props => {
  const { clearForm, ticketNumbers, round, disabled, className, variant = ListActionVariant.button } = props;
  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, LotteryPurchaseABI, web3Context.provider?.getSigner());

      return contract
        .purchaseLottery(
          {
            externalId: round.id,
            expiresAt: sign.expiresAt,
            nonce: utils.arrayify(sign.nonce),
            extra: bool36ArrayToByte32(ticketNumbers),
            receiver: round.contract?.address,
            referrer: settings.getReferrer(),
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
        )
        .then(clearForm) as Promise<void>;
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
          referrer: settings.getReferrer(),
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
      disabled={disabled}
      variant={variant}
    />
  );
};
