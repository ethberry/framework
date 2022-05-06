import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api";
import { IErc721Template, IMarketplaceSignature } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";
import MarketplaceERC721 from "@framework/binance-contracts/artifacts/contracts/Marketplace/MarketplaceERC721.sol/MarketplaceERC721.json";

interface IErc721TemplateBuyButtonProps {
  template: IErc721Template;
}

export const Erc721ItemTemplateBuyButton: FC<IErc721TemplateBuyButtonProps> = props => {
  const { template } = props;

  const api = useApi();
  const { library } = useWeb3React();

  const handleBuy = useMetamask(() => {
    return api
      .fetchJson({
        url: "/erc721-marketplace/sign-template",
        method: "POST",
        data: { templateId: template.id },
      })
      .then((sign: IMarketplaceSignature) => {
        const contract = new ethers.Contract(
          process.env.ERC721_MARKETPLACE_ADDR,
          MarketplaceERC721.abi,
          library.getSigner(),
        );
        const nonce = ethers.utils.arrayify(sign.nonce);
        const commonItemPrice = ethers.utils.parseUnits(template.price, "wei");
        return contract.buyCommon(
          nonce,
          template.erc721Collection?.address,
          template.id,
          process.env.ACCOUNT,
          sign.signature,
          {
            value: commonItemPrice,
          },
        ) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBuy} data-testid="Erc721ItemTemplateBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
