import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IMerge } from "@framework/types";
import { TokenType } from "@framework/types";

import CraftABI from "../../../../../abis/mechanics/craft/craft.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";

interface ICraftButtonProps {
  className?: string;
  merge: IMerge;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const MergeButton: FC<ICraftButtonProps> = props => {
  const { className, merge, disabled, variant = ListActionVariant.button } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, CraftABI, web3Context.provider?.getSigner());

      return contract.merge(
        {
          externalId: merge.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: merge.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        merge.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId:
            component.contract!.contractType === TokenType.ERC1155
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          amount: component.amount,
        })),
        merge.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        sign.signature,
        {
          value: getEthPrice(merge.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
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
          referrer: settings.getReferrer(),
          craftId: merge.id,
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
      message="form.buttons.merge"
      className={className}
      dataTestId="MergeButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
