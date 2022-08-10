import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { IServerSignature } from "@gemunion/types-collection";
import { IDrop, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { getEthPrice } from "../../../../utils/money";

interface IDropPurchaseButtonProps {
  drop: IDrop;
}

export const DropPurchaseButton: FC<IDropPurchaseButtonProps> = props => {
  const { drop } = props;

  const [searchParams] = useSearchParams();

  const metaFnWithSign = useServerSignature(
    (_values: Record<string, any>, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
      return contract.purchase(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: drop.id,
          expiresAt: sign.expiresAt,
          referrer: searchParams.get("referrer") ?? constants.AddressZero,
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
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/drops/sign",
        method: "POST",
        data: {
          dropId: drop.id,
          account,
          referrer: searchParams.get("referrer") ?? constants.AddressZero,
        },
      },
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
