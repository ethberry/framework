import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";

import RafflePurchaseABI from "../../../../../abis/mechanics/lottery/purchase/purchase.abi.json";

export const RafflePurchaseButton: FC = () => {
  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.RAFFLE_ADDR, RafflePurchaseABI, web3Context.provider?.getSigner());
      return contract.purchase(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: 0,
          expiresAt: sign.expiresAt,
          referrer: settings.getReferrer(),
          extra: utils.formatBytes32String("0x"),
        },
        constants.WeiPerEther,
        sign.signature,
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
