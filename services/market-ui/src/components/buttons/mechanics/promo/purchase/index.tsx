import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { IAssetPromo, IMysteryBox, ModuleType, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";

import PromoPurchaseABI from "../../../../../abis/mechanics/promo/purchase/purchase.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";

interface IPromoWithMystery extends IAssetPromo {
  box?: IMysteryBox;
}

interface IPromoPurchaseButtonProps {
  promo: IPromoWithMystery;
}

export const PromoPurchaseButton: FC<IPromoPurchaseButtonProps> = props => {
  const { promo } = props;

  const mysteryComponents = promo.item?.components.filter(
    component => component.contract!.contractModule === ModuleType.MYSTERY,
  );

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, PromoPurchaseABI, web3Context.provider?.getSigner());

      return mysteryComponents && mysteryComponents.length > 0
        ? (contract.purchaseMystery(
            {
              externalId: promo.id,
              expiresAt: sign.expiresAt,
              nonce: utils.arrayify(sign.nonce),
              extra: utils.formatBytes32String("0x"),
              receiver: promo.merchant!.wallet,
              referrer: settings.getReferrer(),
            },
            [
              ...promo.box!.item!.components.sort(sorter("id")).map(component => ({
                tokenType: Object.values(TokenType).indexOf(component.tokenType),
                token: component.contract!.address,
                // tokenId: component.templateId || 0,
                tokenId:
                  component.contract!.contractType === TokenType.ERC1155
                    ? component.template!.tokens![0].tokenId
                    : (component.templateId || 0).toString(),
                amount: component.amount,
              })),
              promo.item?.components.sort(sorter("id")).map(component => ({
                tokenType: Object.values(TokenType).indexOf(component.tokenType),
                token: component.contract!.address,
                tokenId: (component.templateId || 0).toString(), // suppression types check with 0
                amount: component.amount,
              }))[0],
            ],
            promo.price?.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract!.address,
              tokenId: component.template!.tokens![0].tokenId,
              amount: component.amount,
            })),
            sign.signature,
            {
              value: getEthPrice(promo.price),
            },
          ) as Promise<void>)
        : (contract.purchase(
            {
              externalId: promo.id,
              expiresAt: sign.expiresAt,
              nonce: utils.arrayify(sign.nonce),
              extra: utils.formatBytes32String("0x"),
              receiver: promo.merchant!.wallet,
              referrer: settings.getReferrer(),
            },
            promo.item?.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract!.address,
              tokenId: (component.templateId || 0).toString(), // suppression types check with 0
              amount: component.amount,
            }))[0],
            promo.price?.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract!.address,
              tokenId: component.template!.tokens![0].tokenId,
              amount: component.amount,
            })),
            sign.signature,
            {
              value: getEthPrice(promo.price),
            },
          ) as Promise<void>);
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/promos/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer: settings.getReferrer(),
          promoId: promo.id,
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
    <Button onClick={handleBuy} data-testid="PromoPurchaseButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
