import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@ethberry/types-blockchain";
import { useAppSelector } from "@ethberry/redux";
import { walletSelectors } from "@ethberry/provider-wallet";
import { useAllowance, useMetamask, useServerSignature } from "@ethberry/react-hooks-eth";
import { TokenType } from "@ethberry/types-blockchain";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  getEthPrice,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IMysteryBox } from "@framework/types";

import ExchangeMysteryBoxFacetPurchaseMysteryABI from "@framework/abis/json/ExchangeMysteryBoxFacet/purchaseMystery.json";

interface IMysteryBoxBuyButtonProps {
  className?: string;
  disabled?: boolean;
  mysteryBox: IMysteryBox;
  variant?: ListActionVariant;
}

export const MysteryBoxPurchaseButton: FC<IMysteryBoxBuyButtonProps> = props => {
  const { className, disabled, mysteryBox, variant = ListActionVariant.button } = props;

  const referrer = useAppSelector(walletSelectors.referrerSelector);

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangeMysteryBoxFacetPurchaseMysteryABI,
        web3Context.provider?.getSigner(),
      );

      const content = convertDatabaseAssetToChainAsset(mysteryBox.content!.components);
      const price = convertDatabaseAssetToChainAsset(mysteryBox.template!.price!.components);

      return contract.purchaseMystery(
        {
          externalId: mysteryBox.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: constants.HashZero,
          receiver: mysteryBox.template!.contract!.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        {
          tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
          token: mysteryBox.template!.contract!.address,
          tokenId: mysteryBox.templateId,
          amount: "1",
        },
        price,
        content,
        sign.signature,
        {
          value: getEthPrice(mysteryBox.template?.price),
        },
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const price = convertDatabaseAssetToTokenTypeAsset(mysteryBox.template!.price!.components);
      return metaFnWithAllowance(
        { contract: systemContract.address, assets: price },
        web3Context,
        sign,
        systemContract,
      );
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/mystery/sign",
        method: "POST",
        data: {
          referrer,
          mysteryBoxId: mysteryBox.id,
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
      dataTestId="MysteryBoxPurchaseButton"
      disabled={disabled}
      variant={variant}
    />
  );
};