import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useAppSelector } from "@gemunion/redux";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { getEthPrice } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, ICraft } from "@framework/types";
import { TokenType } from "@framework/types";

import CraftABI from "@framework/abis/craft/ExchangeCraftFacet.json";

import { sorter } from "../../../../../utils/sorter";

interface ICraftButtonProps {
  className?: string;
  craft: ICraft;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const CraftButton: FC<ICraftButtonProps> = props => {
  const { className, craft, disabled, variant = ListActionVariant.button } = props;

  const { referrer } = useAppSelector(state => state.settings);

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, CraftABI, web3Context.provider?.getSigner());

      return contract.craft(
        {
          externalId: craft.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: craft.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        craft.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId:
            component.contract!.contractType === TokenType.ERC1155
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          amount: component.amount,
        })),
        craft.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        sign.signature,
        {
          value: getEthPrice(craft.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {

    return metaFnWithSign(
      {
        url: "/recipes/craft/sign",
        method: "POST",
        data: {
          referrer,
          craftId: craft.id,
        },
      },
      null,
      web3Context,
    ) as Promise<void>;
  });

  const handleCraft = async () => {
    await metaFn();
  };

  return (
    <ListAction
      onClick={handleCraft}
      message="form.buttons.craft"
      className={className}
      dataTestId="CraftButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
