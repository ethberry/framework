import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useAppSelector } from "@gemunion/redux";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  getEthPrice,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, ICraft } from "@framework/types";

import CraftABI from "@framework/abis/craft/ExchangeCraftFacet.json";

import { useAllowance } from "../../../../../utils/use-allowance";

interface ICraftButtonProps {
  className?: string;
  craft: ICraft;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const CraftButton: FC<ICraftButtonProps> = props => {
  const { className, craft, disabled, variant = ListActionVariant.button } = props;

  const { referrer } = useAppSelector(state => state.settings);

  const metaFnWithAllowance = useAllowance(
    async (web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, CraftABI, web3Context.provider?.getSigner());

      const items = convertDatabaseAssetToChainAsset(craft.item?.components);
      const price = convertDatabaseAssetToChainAsset(craft.price?.components);

      return contract.craft(
        {
          externalId: craft.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: craft.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        items,
        price,
        sign.signature,
        {
          value: getEthPrice(craft.price),
        },
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const price = convertDatabaseAssetToTokenTypeAsset(craft.price?.components);
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
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/recipes/craft/sign",
        method: "POST",
        data: {
          chainId,
          account,
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
