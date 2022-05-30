import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api";
import { IServerSignature } from "@gemunion/types-collection";
import { IErc721Dropbox } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC721MarketplaceSol from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC721Marketplace.sol/ERC721Marketplace.json";

interface IErc721DropboxBuyButtonProps {
  dropbox: IErc721Dropbox;
}

export const Erc721DropboxTemplateBuyButton: FC<IErc721DropboxBuyButtonProps> = props => {
  const { dropbox } = props;

  const api = useApi();
  const { library } = useWeb3React();

  const handleBuy = useMetamask(() => {
    return api
      .fetchJson({
        url: "/erc721-marketplace/sign-dropbox",
        method: "POST",
        data: { templateId: dropbox.id },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(
          process.env.ERC721_MARKETPLACE_ADDR,
          ERC721MarketplaceSol.abi,
          library.getSigner(),
        );
        const nonce = utils.arrayify(sign.nonce);
        const commonDropboxPrice = utils.parseUnits(dropbox.price, "wei");

        return contract.buyDropbox(
          nonce,
          dropbox.erc721Collection?.address,
          dropbox.erc721TemplateId, // Dropbox content
          process.env.ACCOUNT,
          sign.signature,
          {
            value: commonDropboxPrice,
          },
        ) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBuy} data-testid="Erc721DropboxTemplateBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
