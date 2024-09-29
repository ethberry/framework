import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@ethberry/types-blockchain";
import { useAppSelector } from "@ethberry/redux";
import { walletSelectors } from "@ethberry/provider-wallet";
import { useAllowance, useMetamask, useServerSignature } from "@ethberry/react-hooks-eth";
import { TokenType } from "@ethberry/types-blockchain";
import {
  getEthPrice,
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, ILootBox } from "@framework/types";

import ExchangeLootBoxFacetPurchaseLootABI from "@framework/abis/json/ExchangeLootBoxFacet/purchaseLoot.json";

interface ILootBoxBuyButtonProps {
  className?: string;
  disabled?: boolean;
  lootBox: ILootBox;
  variant?: ListActionVariant;
}

export const LootBoxPurchaseButton: FC<ILootBoxBuyButtonProps> = props => {
  const { className, disabled, lootBox, variant = ListActionVariant.button } = props;

  const referrer = useAppSelector(walletSelectors.referrerSelector);

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangeLootBoxFacetPurchaseLootABI,
        web3Context.provider?.getSigner(),
      );
      const content = convertDatabaseAssetToChainAsset([...lootBox.content!.components]);
      const price = convertDatabaseAssetToChainAsset([...lootBox.template!.price!.components]);
      return contract.purchaseLoot(
        {
          externalId: lootBox.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: lootBox.template!.contract!.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        {
          tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
          token: lootBox.template!.contract!.address,
          tokenId: lootBox.templateId,
          amount: "1",
        },
        price,
        content,
        {
          min: lootBox.min,
          max: lootBox.max,
        },
        sign.signature,
        {
          value: getEthPrice(lootBox.template?.price),
        },
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const price = convertDatabaseAssetToTokenTypeAsset(lootBox.template!.price!.components);
      return metaFnWithAllowance(
        { contract: systemContract.address, assets: price },
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
        url: "/loot/sign",
        method: "POST",
        data: {
          referrer,
          lootBoxId: lootBox.id,
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
      dataTestId="LootBoxPurchaseButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
