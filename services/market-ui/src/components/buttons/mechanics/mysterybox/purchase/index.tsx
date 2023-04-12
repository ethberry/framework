import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { IMysterybox, TokenType } from "@framework/types";

import MysteryboxPurchaseABI from "../../../../../abis/components/buttons/mechanics/mysterybox/purchase/mysterybox.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";

interface IMysteryboxBuyButtonProps {
  mysterybox: IMysterybox;
}

export const MysteryboxPurchaseButton: FC<IMysteryboxBuyButtonProps> = props => {
  const { mysterybox } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature((_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, MysteryboxPurchaseABI, web3Context.provider?.getSigner());

    const items = ([] as Array<any>).concat(
      mysterybox.item?.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId,
        amount: component.amount,
      })),
      [
        {
          id: mysterybox.id,
          tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
          token: mysterybox.template!.contract!.address,
          tokenId: mysterybox.templateId,
          amount: "1",
        },
      ],
    );

    return contract.mysterybox(
      {
        nonce: utils.arrayify(sign.nonce),
        externalId: mysterybox.id,
        expiresAt: sign.expiresAt,
        referrer: constants.AddressZero,
      },
      items,
      mysterybox.template?.price?.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.template!.tokens![0].tokenId,
        amount: component.amount,
      })),
      sign.signature,
      {
        value: getEthPrice(mysterybox.template?.price),
      },
    ) as Promise<void>;
  });

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/mysteryboxes/sign",
        method: "POST",
        data: {
          account,
          referrer: settings.getReferrer(),
          mysteryboxId: mysterybox.id,
        },
      },
      null,
      web3Context,
    );
  });

  const handleBuy = async () => {
    await metaFn();
  };

  return (
    <Button onClick={handleBuy} data-testid="MysteryboxTemplateBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
