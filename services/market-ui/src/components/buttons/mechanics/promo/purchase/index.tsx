import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useAppSelector } from "@gemunion/redux";
import { walletSelectors } from "@gemunion/provider-wallet";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { getEthPrice } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IAssetPromo, IContract, IMysteryBox } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import PurchaseABI from "@framework/abis/json/ExchangePurchaseFacet/purchase.json";
import PurchaseMysteryABI from "@framework/abis/json/ExchangeMysteryBoxFacet/purchaseMystery.json";

import { sorter } from "../../../../../utils/sorter";

interface IPromoWithMystery extends IAssetPromo {
  box?: IMysteryBox;
}

interface IPromoPurchaseButtonProps {
  className?: string;
  disabled?: boolean;
  promo: IPromoWithMystery;
  variant?: ListActionVariant;
}

export const PromoPurchaseButton: FC<IPromoPurchaseButtonProps> = props => {
  const { className, disabled, promo, variant = ListActionVariant.button } = props;

  const mysteryComponents = promo.item?.components.filter(
    component => component.contract!.contractModule === ModuleType.MYSTERY,
  );

  const referrer = useAppSelector(walletSelectors.referrerSelector);

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        PurchaseABI.concat(PurchaseMysteryABI),
        web3Context.provider?.getSigner(),
      );

      return mysteryComponents && mysteryComponents.length > 0
        ? (contract.purchaseMystery(
            {
              externalId: promo.id,
              expiresAt: sign.expiresAt,
              nonce: utils.arrayify(sign.nonce),
              extra: utils.formatBytes32String("0x"),
              receiver: promo.merchant!.wallet,
              referrer,
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
              referrer,
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
    return metaFnWithSign(
      {
        url: "/promos/sign",
        method: "POST",
        data: {
          referrer,
          promoId: promo.id,
        },
      },
      null,
      web3Context,
    ) as Promise<void>;
  });

  const handleBuy = async () => {
    await metaFn();
  };

  return (
    <ListAction
      onClick={handleBuy}
      message="form.buttons.buy"
      className={className}
      dataTestId="PromoPurchaseButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
