import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { useMetamask, useServerSignature, useSystemContract } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract, IMysteryBox } from "@framework/types";
import { SystemModuleType, TokenType } from "@framework/types";

import MysteryBoxPurchaseABI from "../../../../../abis/mechanics/mysterybox/purchase/mysterybox.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";

interface IMysteryBoxBuyButtonProps {
  className?: string;
  disabled?: boolean;
  mysteryBox: IMysteryBox;
  variant?: ListActionVariant;
}

export const MysteryBoxPurchaseButton: FC<IMysteryBoxBuyButtonProps> = props => {
  const { className, disabled, mysteryBox, variant = ListActionVariant.button } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, MysteryBoxPurchaseABI, web3Context.provider?.getSigner());

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
          ...mysteryBox.item!.components.sort(sorter("id")).map(component => ({
            tokenType: Object.values(TokenType).indexOf(component.tokenType),
            token: component.contract!.address,
            // tokenId: component.templateId || 0,
            tokenId:
              component.contract!.contractType === TokenType.ERC1155
                ? component.template!.tokens![0].tokenId
                : (component.templateId || 0).toString(),
            amount: component.amount,
          })),
          {
            tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
            token: mysteryBox.template!.contract!.address,
            tokenId: mysteryBox.templateId,
            amount: "1",
          },
        ],
        mysteryBox.template?.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        sign.signature,
        {
          value: getEthPrice(mysteryBox.template?.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (_values: null, web3Context: Web3ContextType, systemContract: IContract) => {
      const { chainId, account } = web3Context;
      return metaFnWithSign(
        {
          url: "/mystery/sign",
          method: "POST",
          data: {
            chainId,
            account,
            referrer: settings.getReferrer(),
            mysteryBoxId: mysteryBox.id,
          },
        },
        null,
        web3Context,
        systemContract,
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.EXCHANGE, null, web3Context);
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
