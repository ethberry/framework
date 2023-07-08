import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";
import type { ILotteryRound } from "@framework/types";
import { TokenType } from "@framework/types";

import LotteryPurchaseABI from "../../../../../abis/mechanics/lottery/purchase/purchase.abi.json";
import { getEthPrice } from "../../../../../utils/money";
import { boolArrayToByte32 } from "./utils";

export interface ILotteryPurchaseButtonProps {
  round: Partial<ILotteryRound>;
  ticketNumbers: Array<boolean>;
  clearForm: () => void;
  disabled: boolean;
}

export const LotteryPurchaseButton: FC<ILotteryPurchaseButtonProps> = props => {
  const { clearForm, ticketNumbers, round, disabled } = props;
  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, LotteryPurchaseABI, web3Context.provider?.getSigner());

      return contract
        .purchaseLottery(
          {
            nonce: utils.arrayify(sign.nonce),
            externalId: round.id,
            expiresAt: sign.expiresAt,
            referrer: settings.getReferrer(),
            extra: boolArrayToByte32(ticketNumbers),
          },
          [
            {
              tokenType: 0,
              token: round.contract?.address,
              tokenId: "0",
              amount: "0",
            },
            {
              tokenType: 2,
              token: round.ticketContract?.address,
              tokenId: "0",
              amount: "1",
            },
          ],
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
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/lottery/ticket/sign",
        method: "POST",
        data: {
          account,
          referrer: settings.getReferrer(),
          ticketNumbers: boolArrayToByte32(ticketNumbers),
          roundId: round.id,
        },
      },
      null,
      web3Context,
    );
  });

  const handlePurchase = () => {
    return metaFn();
  };

  return (
    <Button startIcon={<Casino />} onClick={handlePurchase} disabled={disabled} data-testid="LotteryBuyTicket">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
