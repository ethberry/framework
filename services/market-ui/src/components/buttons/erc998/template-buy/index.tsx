import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { IUniTemplate, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC998MarketplaceSol from "@framework/core-contracts/artifacts/contracts/Marketplace/ERC721Marketplace.sol/ERC721Marketplace.json";

interface IUniTemplateBuyButtonProps {
  template: IUniTemplate;
}

export const Erc998ItemTemplateBuyButton: FC<IUniTemplateBuyButtonProps> = props => {
  const { template } = props;

  const api = useApi();
  const { library } = useWeb3React();

  const handleBuy = useMetamask(() => {
    return api
      .fetchJson({
        url: "/erc998-marketplace/sign-template",
        method: "POST",
        data: { templateId: template.id },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(
          process.env.ERC721_MARKETPLACE_ADDR,
          ERC998MarketplaceSol.abi,
          library.getSigner(),
        );
        const nonce = utils.arrayify(sign.nonce);
        const commonItemPrice = utils.parseUnits(template.price?.components[0].amount || "0", "wei");
        return contract.buyCommon(
          nonce,
          template.uniContract?.address,
          template.id,
          process.env.ACCOUNT,
          sign.signature,
          {
            value: template.price?.components[0].tokenType === TokenType.NATIVE ? commonItemPrice : 0,
          },
        ) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBuy} data-testid="Erc998ItemTemplateBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
