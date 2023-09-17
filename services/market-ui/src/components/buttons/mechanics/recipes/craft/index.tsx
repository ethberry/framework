import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { ICraft } from "@framework/types";
import { TokenType } from "@framework/types";

import CraftABI from "../../../../../abis/mechanics/craft/craft.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";

interface ICraftButtonProps {
  craft: ICraft;
}

export const CraftButton: FC<ICraftButtonProps> = props => {
  const { craft } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, CraftABI, web3Context.provider?.getSigner());

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
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/craft/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer: settings.getReferrer(),
          craftId: craft.id,
        },
      },
      null,
      web3Context,
    );
  });

  const handleCraft = async () => {
    await metaFn();
  };

  return (
    <Button onClick={handleCraft} data-testid="CraftButton">
      <FormattedMessage id="form.buttons.craft" />
    </Button>
  );
};