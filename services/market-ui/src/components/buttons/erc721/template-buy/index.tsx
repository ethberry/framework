import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api";
import { IServerSignature } from "@gemunion/types-collection";
import { IErc721Template } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";
import ERC721Marketplace from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC721Marketplace.sol/ERC721Marketplace.json";

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
      .then((sign: IServerSignature) => {
        const contract = new Contract(process.env.ERC721_MARKETPLACE_ADDR, ERC721Marketplace.abi, library.getSigner());
        const nonce = utils.arrayify(sign.nonce);
        const commonItemPrice = utils.parseUnits(template.price, "wei");
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
