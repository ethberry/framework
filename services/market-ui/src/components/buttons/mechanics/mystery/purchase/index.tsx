import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useAppSelector } from "@gemunion/redux";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { convertDatabaseAssetToChainAsset, getEthPrice } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IMysteryBox } from "@framework/types";
import { TokenType } from "@framework/types";

import MysteryBoxPurchaseABI from "@framework/abis/purchaseMystery/ExchangeMysteryBoxFacet.json";

interface IMysteryBoxBuyButtonProps {
  className?: string;
  disabled?: boolean;
  mysteryBox: IMysteryBox;
  variant?: ListActionVariant;
}

export const MysteryBoxPurchaseButton: FC<IMysteryBoxBuyButtonProps> = props => {
  const { className, disabled, mysteryBox, variant = ListActionVariant.button } = props;

  const { referrer } = useAppSelector(state => state.settings);

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, MysteryBoxPurchaseABI, web3Context.provider?.getSigner());

      const items = convertDatabaseAssetToChainAsset(mysteryBox.item!.components);
      const price = convertDatabaseAssetToChainAsset(mysteryBox.template!.price!.components);

      return contract.purchaseMystery(
        {
          externalId: mysteryBox.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: mysteryBox.template!.contract!.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        [
          ...items,
          {
            tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
            token: mysteryBox.template!.contract!.address,
            tokenId: mysteryBox.templateId,
            amount: "1",
          },
        ],
        price,
        sign.signature,
        {
          value: getEthPrice(mysteryBox.template?.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;
    return metaFnWithSign(
      {
        url: "/mystery/sign",
        method: "POST",
        data: {
          chainId,
          account,
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
