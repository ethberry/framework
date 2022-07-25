import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { IServerSignature } from "@gemunion/types-collection";
import { ILootbox, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { getEthPrice } from "../../../../utils/money";

interface ILootboxBuyButtonProps {
  lootbox: ILootbox;
}

export const LootboxBuyButton: FC<ILootboxBuyButtonProps> = props => {
  const { lootbox } = props;

  const metaFnWithSign = useServerSignature(
    (_values: Record<string, any>, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
      return contract.lootbox(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: lootbox.id,
          expiresAt: sign.expiresAt,
        },
        {
          // TODO pass lootbox.item.components[0].template.id, probably as amount
          tokenType: Object.keys(TokenType).indexOf(TokenType.ERC721),
          token: process.env.LOOTBOX_ADDR,
          tokenId: lootbox.id,
          amount: 1,
        },
        lootbox.price?.components.map(component => ({
          tokenType: Object.keys(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        process.env.ACCOUNT,
        sign.signature,
        {
          value: getEthPrice(lootbox.price),
        },
      ) as Promise<void>;
    });

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign({
      url: "/lootboxes/sign",
      method: "POST",
      data: {
        lootboxId: lootbox.id,
        account,
      },
    }, web3Context);
  });

  const handleBuy = async () => {
    await metaFn();
  };

  return (
    <Button onClick={handleBuy} data-testid="LootboxTemplateBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
