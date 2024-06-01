import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useAppSelector } from "@gemunion/redux";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { getEthPrice, convertDatabaseAssetToChainAsset } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, ILootBox } from "@framework/types";
import { TokenType } from "@framework/types";

import LootBoxPurchaseABI from "@framework/abis/purchaseLoot/ExchangeLootBoxFacet.json";

interface ILootBoxBuyButtonProps {
  className?: string;
  disabled?: boolean;
  lootBox: ILootBox;
  variant?: ListActionVariant;
}

export const LootBoxPurchaseButton: FC<ILootBoxBuyButtonProps> = props => {
  const { className, disabled, lootBox, variant = ListActionVariant.button } = props;

  const { referrer } = useAppSelector(state => state.settings);

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, LootBoxPurchaseABI, web3Context.provider?.getSigner());

      const items = convertDatabaseAssetToChainAsset([...lootBox.item!.components]);
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
        [
          ...items,
          {
            tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
            token: lootBox.template!.contract!.address,
            tokenId: lootBox.templateId,
            amount: "1",
          },
        ],
        price,
        sign.signature,
        {
          value: getEthPrice(lootBox.template?.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;
    return metaFnWithSign(
      {
        url: "/loot/sign",
        method: "POST",
        data: {
          chainId,
          account,
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