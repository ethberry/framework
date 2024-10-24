import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { useAppSelector } from "@ethberry/redux";
import { walletSelectors } from "@ethberry/provider-wallet";
import { useAllowance, useMetamask, useServerSignature } from "@ethberry/react-hooks-eth";
import type { IServerSignature } from "@ethberry/types-blockchain";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  convertTemplateToChainAsset,
  getEthPrice,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IAssetPromo, IContract, ILootBox, IMysteryBox } from "@framework/types";

import ExchangePurchaseFacetPurchaseABI from "@framework/abis/json/ExchangePurchaseFacet/purchase.json";

interface IPromoWithMystery extends IAssetPromo {
  box?: IMysteryBox | ILootBox;
}

interface IPromoPurchaseButtonProps {
  className?: string;
  disabled?: boolean;
  promo: IPromoWithMystery;
  variant?: ListActionVariant;
}

export const PromoPurchaseButton: FC<IPromoPurchaseButtonProps> = props => {
  const { className, disabled, promo, variant = ListActionVariant.button } = props;

  const referrer = useAppSelector(walletSelectors.referrerSelector);

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangePurchaseFacetPurchaseABI,
        web3Context.provider?.getSigner(),
      );

      const item = convertTemplateToChainAsset(promo.item!.components[0].template);
      const price = convertDatabaseAssetToChainAsset(promo.price!.components);

      return contract.purchase(
        {
          externalId: promo.item!.components[0].template!.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: constants.HashZero,
          receiver: promo.merchant!.wallet,
          referrer,
        },
        item,
        price,
        sign.signature,
        {
          value: getEthPrice(promo.price),
        },
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const price = convertDatabaseAssetToTokenTypeAsset(promo.price!.components);
      return metaFnWithAllowance(
        {
          contract: systemContract.address,
          assets: price,
        },
        web3Context,
        sign,
        systemContract,
      );
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
