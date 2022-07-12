import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { IDropbox, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import MarketplaceSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Marketplace/Marketplace.sol/Marketplace.json";

interface IDropboxBuyButtonProps {
  dropbox: IDropbox;
}

export const DropboxBuyButton: FC<IDropboxBuyButtonProps> = props => {
  const { dropbox } = props;

  const api = useApi();
  const { provider } = useWeb3React();

  const handleBuy = useMetamask(() => {
    return api
      .fetchJson({
        url: "/erc998-marketplace/sign-dropbox",
        method: "POST",
        data: { templateId: dropbox.id },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(process.env.MARKETPLACE_ADDR, MarketplaceSol.abi, provider?.getSigner());
        const nonce = utils.arrayify(sign.nonce);
        const commonDropboxPrice = utils.parseUnits(dropbox.price.components[0].amount, "wei");

        return contract.buyDropbox(
          nonce,
          dropbox.contract?.address,
          dropbox.templateId, // Dropbox content
          process.env.ACCOUNT,
          sign.signature,
          {
            value: dropbox.price.components[0].tokenType === TokenType.NATIVE ? commonDropboxPrice : 0,
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
