import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { IServerSignature } from "@gemunion/types-collection";
import { ICraft, TokenType } from "@framework/types";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { getEthPrice } from "../../../../utils/money";

interface ICraftButtonProps {
  craft: ICraft;
}

export const CraftButton: FC<ICraftButtonProps> = props => {
  const { craft } = props;

  const metaFnWithSign = useServerSignature(
    (_values: Record<string, any>, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());

      return contract.craft(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: craft.id,
          expiresAt: sign.expiresAt,
        },
        craft.item?.components.map(component => ({
          tokenType: Object.keys(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        craft.ingredients?.components.map(component => ({
          tokenType: Object.keys(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        process.env.ACCOUNT,
        sign.signature,
        {
          value: getEthPrice(craft.ingredients),
        },
      ) as Promise<void>;
    });

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithSign({
      url: "/craft/sign",
      method: "POST",
      data: {
        craftId: craft.id,
      },
    }, web3Context);
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
