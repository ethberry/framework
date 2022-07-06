import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { ITemplate, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC998MarketplaceSol from "@framework/core-contracts/artifacts/contracts/Marketplace/ERC721Marketplace.sol/ERC721Marketplace.json";

interface ITemplateBuyButtonProps {
  template: ITemplate;
}

export const Erc998ItemTemplateBuyButton: FC<ITemplateBuyButtonProps> = props => {
  const { template } = props;

  const api = useApi();
  const { provider } = useWeb3React();

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
          provider?.getSigner(),
        );
        const nonce = utils.arrayify(sign.nonce);
        const commonItemPrice = utils.parseUnits(template.price?.components[0].amount || "0", "wei");
        return contract.buyCommon(nonce, template.contract?.address, template.id, process.env.ACCOUNT, sign.signature, {
          value: template.price?.components[0].tokenType === TokenType.NATIVE ? commonItemPrice : 0,
        }) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBuy} data-testid="Erc998ItemTemplateBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
