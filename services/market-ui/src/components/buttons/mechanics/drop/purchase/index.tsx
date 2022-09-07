import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-collection";
import { useSettings } from "@gemunion/provider-settings";
import { IDrop, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { getEthPrice } from "../../../../../utils/money";

interface IDropPurchaseButtonProps {
  drop: IDrop;
}

export const DropPurchaseButton: FC<IDropPurchaseButtonProps> = props => {
  const { drop } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature((_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
    return contract.purchase(
      {
        nonce: utils.arrayify(sign.nonce),
        externalId: drop.id,
        expiresAt: sign.expiresAt,
        referrer: settings.getReferrer(),
      },
      drop.item?.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId,
        amount: component.amount,
      }))[0],
      drop.price?.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.template!.tokens![0].tokenId,
        amount: component.amount,
      })),
      process.env.ACCOUNT,
      sign.signature,
      {
        value: getEthPrice(drop.price),
      },
    ) as Promise<void>;
  });

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/drops/sign",
        method: "POST",
        data: {
          dropId: drop.id,
          account,
          referrer: settings.getReferrer(),
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
    <Button onClick={handleBuy} data-testid="DropPurchaseButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
