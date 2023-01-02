import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { IMysterybox, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { getEthPrice } from "../../../../../utils/money";

interface IMysteryboxBuyButtonProps {
  mysterybox: IMysterybox;
}

export const MysteryBoxPurchaseButton: FC<IMysteryboxBuyButtonProps> = props => {
  const { mysterybox } = props;

  const metaFnWithSign = useServerSignature((_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
    return contract.mysterybox(
      {
        nonce: utils.arrayify(sign.nonce),
        externalId: mysterybox.id,
        expiresAt: sign.expiresAt,
        referrer: constants.AddressZero,
      },
      ([] as Array<any>).concat(
        mysterybox.item?.components.map(component => ({
          tokenType: Object.keys(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.templateId,
          amount: component.amount,
        })),
        {
          tokenType: Object.keys(TokenType).indexOf(TokenType.ERC721),
          token: mysterybox.template!.contract!.address,
          tokenId: mysterybox.id.toString(),
          amount: "1",
        },
      ),
      mysterybox.template?.price?.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
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
          mysteryboxId: mysterybox.id,
          account,
          referrer: constants.AddressZero,
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
