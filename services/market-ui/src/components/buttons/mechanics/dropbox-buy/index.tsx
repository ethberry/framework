import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { IDropbox, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";
import { getEthPrice } from "../../../../utils/money";

interface IDropboxBuyButtonProps {
  dropbox: IDropbox;
}

export const DropboxBuyButton: FC<IDropboxBuyButtonProps> = props => {
  const { dropbox } = props;

  const api = useApi();
  const { provider, account } = useWeb3React();

  const handleBuy = useMetamask(() => {
    return api
      .fetchJson({
        url: "/marketplace/dropbox",
        method: "POST",
        data: {
          dropboxId: dropbox.id,
          account,
        },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, provider?.getSigner());

        return contract.execute(
          utils.arrayify(sign.nonce),
          [
            {
              tokenType: Object.keys(TokenType).indexOf(dropbox.contract!.contractType),
              token: dropbox.contract?.address,
              tokenId: dropbox.id,
              amount: 1,
            },
          ],
          dropbox.price?.components.map(component => ({
            tokenType: Object.keys(TokenType).indexOf(component.tokenType),
            token: component.contract?.address,
            tokenId: component.token?.tokenId,
            amount: component.amount,
          })),
          process.env.ACCOUNT,
          sign.signature,
          {
            value: getEthPrice(dropbox),
          },
        ) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBuy} data-testid="Erc998DropboxTemplateBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
