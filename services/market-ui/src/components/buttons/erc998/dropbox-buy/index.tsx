import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { Erc20TokenTemplate, IErc998Dropbox } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC998MarketplaceSol from "@framework/core-contracts/artifacts/contracts/Marketplace/ERC721Marketplace.sol/ERC721Marketplace.json";

interface IErc998DropboxBuyButtonProps {
  dropbox: IErc998Dropbox;
}

export const Erc998DropboxTemplateBuyButton: FC<IErc998DropboxBuyButtonProps> = props => {
  const { dropbox } = props;

  const api = useApi();
  const { library } = useWeb3React();

  const handleBuy = useMetamask(() => {
    return api
      .fetchJson({
        url: "/erc998-marketplace/sign-dropbox",
        method: "POST",
        data: { templateId: dropbox.id },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(
          process.env.ERC721_MARKETPLACE_ADDR,
          ERC998MarketplaceSol.abi,
          library.getSigner(),
        );
        const nonce = utils.arrayify(sign.nonce);
        const commonDropboxPrice = utils.parseUnits(dropbox.price, "wei");

        return contract.buyDropbox(
          nonce,
          dropbox.erc998Collection?.address,
          dropbox.erc998TemplateId, // Dropbox content
          process.env.ACCOUNT,
          sign.signature,
          {
            value:
              dropbox.erc998Template?.erc20Token?.contractTemplate === Erc20TokenTemplate.NATIVE
                ? commonDropboxPrice
                : 0,
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
