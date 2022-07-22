import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { IServerSignature } from "@gemunion/types-collection";
import { ICraft, TokenType } from "@framework/types";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { getEthPrice } from "../../../../utils/money";

interface ICraftButtonProps {
  craft: ICraft;
}

export const CraftButton: FC<ICraftButtonProps> = props => {
  const { craft } = props;

  const api = useApi();
  const { provider } = useWeb3React();

  const handleCraft = useMetamask(() => {
    return api
      .fetchJson({
        url: "/craft/sign",
        method: "POST",
        data: {
          craftId: craft.id,
        },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, provider?.getSigner());
        return contract.craft(
          utils.arrayify(sign.nonce),
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
  });

  return (
    <Button onClick={handleCraft} data-testid="ExchangeCraftButton">
      <FormattedMessage id="form.buttons.craft" />
    </Button>
  );
};
