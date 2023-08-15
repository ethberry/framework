import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";
import type { IRaffleRound } from "@framework/types";
import { TokenType } from "@framework/types";

import RafflePurchaseABI from "../../../../../abis/mechanics/raffle/purchase/purchase.abi.json";
import { getEthPrice } from "../../../../../utils/money";

export interface IRafflePurchaseButtonProps {
  round: Partial<IRaffleRound>;
  disabled: boolean;
}
export const RafflePurchaseButton: FC<IRafflePurchaseButtonProps> = props => {
  const { round, disabled } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, RafflePurchaseABI, web3Context.provider?.getSigner());

      return contract.purchaseRaffle(
        {
          externalId: round.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
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
      ) as Promise<void>;
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
          contractId: round.contractId,
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
    <Button startIcon={<Casino />} onClick={handlePurchase} disabled={disabled} data-testid="RaffleBuyTicket">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
