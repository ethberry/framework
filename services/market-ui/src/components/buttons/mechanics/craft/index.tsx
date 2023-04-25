import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ICraft, TokenType } from "@framework/types";

import CraftABI from "../../../../abis/components/buttons/mechanics/craft/craft.abi.json";

import { getEthPrice } from "../../../../utils/money";
import { sorter } from "../../../../utils/sorter";

interface ICraftButtonProps {
  craft: ICraft;
}

export const CraftButton: FC<ICraftButtonProps> = props => {
  const { craft } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature((_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, CraftABI, web3Context.provider?.getSigner());

    return contract.craft(
      {
        nonce: utils.arrayify(sign.nonce),
        externalId: craft.id,
        expiresAt: sign.expiresAt,
        referrer: constants.AddressZero,
      },
      craft.item?.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId:
          component.contract!.contractType === TokenType.ERC1155
            ? component.template!.tokens![0].tokenId
            : component.templateId.toString(),
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
  });

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/craft/sign",
        method: "POST",
        data: {
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
    <Button onClick={handleCraft} data-testid="ExchangeCraftButton">
      <FormattedMessage id="form.buttons.craft" />
    </Button>
  );
};
