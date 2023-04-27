import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";

import LotteryPurchaseABI from "../../../../../abis/components/buttons/mechanics/lottery/purchase/purchase.abi.json";

export interface ILotteryPurchaseButtonProps {
  ticketNumbers: Array<boolean>;
  clearForm: () => void;
}

export const LotteryPurchaseButton: FC<ILotteryPurchaseButtonProps> = props => {
  const { clearForm, ticketNumbers } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.LOTTERY_ADDR, LotteryPurchaseABI, web3Context.provider?.getSigner());
      return contract
        .purchase(
          {
            nonce: utils.arrayify(sign.nonce),
            externalId: 0,
            expiresAt: sign.expiresAt,
            referrer: settings.getReferrer(),
          },
          ticketNumbers,
          constants.WeiPerEther,
          sign.signature,
        )
        .then(clearForm) as Promise<void>;
    },
    { error: false },
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
          ticketNumbers,
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
