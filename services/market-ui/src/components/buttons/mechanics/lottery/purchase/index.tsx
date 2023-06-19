import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { BigNumber, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";

import LotteryPurchaseABI from "../../../../../abis/mechanics/lottery/purchase/purchase.abi.json";
import { ILotteryRound, TokenType } from "@framework/types";
import { getEthPrice } from "../../../../../utils/money";

export interface ILotteryPurchaseButtonProps {
  round: Partial<ILotteryRound>;
  ticketNumbers: Array<boolean>;
  clearForm: () => void;
}

export const boolArrayToByte32 = (booleans: Array<boolean>) => {
  if (booleans.length > 256) {
    throw new Error("Array length cannot exceed 256");
  }
  const result: Array<string> = [];
  booleans.forEach((value, index) => {
    if (value) {
      result.push(utils.hexZeroPad(utils.hexValue(index + 1), 1));
    }
  });
  const concat = `0x${result.map(res => res.substring(2)).join("")}`;

  return utils.hexZeroPad(concat, 32);
};

export const LotteryPurchaseButton: FC<ILotteryPurchaseButtonProps> = props => {
  const { clearForm, ticketNumbers, round } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, LotteryPurchaseABI, web3Context.provider?.getSigner());
      const params = {
        nonce: utils.arrayify(sign.nonce),
        externalId: 0,
        expiresAt: sign.expiresAt,
        referrer: settings.getReferrer(),
        extra: boolArrayToByte32(ticketNumbers),
      };
      const lotteryItem = [
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
      ];
      // TODO free tickets option?
      const lotteryPrice = {
        tokenType: Object.values(TokenType).indexOf(round.price!.components[0].tokenType),
        token: round.price!.components[0].contract!.address,
        tokenId: round.price!.components[0].template!.tokens![0].tokenId,
        amount: BigNumber.from(round.price!.components[0].amount),
      };

      return contract
        .purchaseLottery(params, lotteryItem, lotteryPrice, sign.signature, {
          value: getEthPrice(round.price),
        })
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
    <Button startIcon={<Casino />} onClick={handlePurchase} data-testid="LotteryBuyTicket">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
