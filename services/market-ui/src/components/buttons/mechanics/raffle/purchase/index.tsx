import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { BigNumber, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";

import RafflePurchaseABI from "../../../../../abis/mechanics/lottery/purchase/purchase.abi.json";
import { IRaffleRound, TokenType } from "@framework/types";
import { getEthPrice } from "../../../../../utils/money";

export interface IRafflePurchaseButtonProps {
  round: Partial<IRaffleRound>;
}
export const RafflePurchaseButton: FC<IRafflePurchaseButtonProps> = props => {
  const { round } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, RafflePurchaseABI, web3Context.provider?.getSigner());

      const params = {
        nonce: utils.arrayify(sign.nonce),
        externalId: 0,
        expiresAt: sign.expiresAt,
        referrer: settings.getReferrer(),
        extra: utils.formatBytes32String("0x"),
      };
      const raffleItem = [
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
      const rafflePrice = {
        tokenType: Object.values(TokenType).indexOf(round.price!.components[0].tokenType),
        token: round.price!.components[0].contract!.address,
        tokenId: round.price!.components[0].template!.tokens![0].tokenId,
        amount: BigNumber.from(round.price!.components[0].amount),
      };

      return contract.purchaseRaffle(params, raffleItem, rafflePrice, sign.signature, {
        value: getEthPrice(round.price),
      }) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/raffle/ticket/sign",
        method: "POST",
        data: {
          account,
          referrer: settings.getReferrer(),
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
    <Button startIcon={<Casino />} onClick={handlePurchase} data-testid="RaffleBuyTicket">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
