import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useAppSelector } from "@gemunion/redux";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  getEthPrice,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IAssetPromo, IContract, IMysteryBox } from "@framework/types";
import { ModuleType } from "@framework/types";

import PurchaseABI from "@framework/abis/purchase/ExchangePurchaseFacet.json";
import PurchaseMysteryABI from "@framework/abis/purchaseMystery/ExchangeMysteryBoxFacet.json";

import { useAllowance } from "../../../../../utils/use-allowance";

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

  const { referrer } = useAppSelector(state => state.settings);

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        PurchaseABI.concat(PurchaseMysteryABI),
        web3Context.provider?.getSigner(),
      );

      const items = convertDatabaseAssetToChainAsset(promo.box?.item?.components);
      const promoItem = convertDatabaseAssetToChainAsset(promo.item?.components);
      const price = convertDatabaseAssetToChainAsset(promo.price?.components);

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
            [...items, promoItem[0]],
            price,
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
            promoItem[0],
            price,
            sign.signature,
            {
              value: getEthPrice(promo.price),
            },
          ) as Promise<void>);
    },
  );

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const price = convertDatabaseAssetToTokenTypeAsset(promo.price?.components);
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
