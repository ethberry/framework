import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { IDrop, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";

import DropPurchaseABI from "../../../../../abis/mechanics/drop/purchase/purchase.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";

interface IDropPurchaseButtonProps {
  drop: IDrop;
}

export const DropPurchaseButton: FC<IDropPurchaseButtonProps> = props => {
  const { drop } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, DropPurchaseABI, web3Context.provider?.getSigner());
      return contract.purchase(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: drop.id,
          expiresAt: sign.expiresAt,
          referrer: settings.getReferrer(),
          extra: utils.formatBytes32String("0x"),
        },
        drop.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.templateId,
          amount: component.amount,
        }))[0],
        drop.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        sign.signature,
        {
          value: getEthPrice(drop.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/drops/sign",
        method: "POST",
        data: {
          account,
          referrer: settings.getReferrer(),
          dropId: drop.id,
        },
      },
      null,
      web3Context,
    );
  });

  const handleBuy = async () => {
    await metaFn();
  };

  return (
    <Button onClick={handleBuy} data-testid="DropPurchaseButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
