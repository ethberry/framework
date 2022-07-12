import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { ContractTemplate, ITemplate } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import MarketplaceSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Marketplace/Marketplace.sol/Marketplace.json";

interface IErc721TemplateBuyButtonProps {
  template: ITemplate;
}

export const Erc721ItemTemplateBuyButton: FC<IErc721TemplateBuyButtonProps> = props => {
  const { template } = props;

  const api = useApi();
  const { provider } = useWeb3React();

  const handleBuy = useMetamask(() => {
    return api
      .fetchJson({
        url: "/erc721-marketplace/sign-template",
        method: "POST",
        data: { templateId: template.id },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(process.env.MARKETPLACE_ADDR, MarketplaceSol.abi, provider?.getSigner());
        const nonce = utils.arrayify(sign.nonce);
        const commonItemPrice = utils.parseUnits(template.price?.components[0].amount || "0", "wei");
        return contract.buyCommon(nonce, template.contract?.address, template.id, process.env.ACCOUNT, sign.signature, {
          value:
            template.price?.components[0].contract!.contractTemplate === ContractTemplate.NATIVE ? commonItemPrice : 0,
        }) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBuy} data-testid="Erc721ItemTemplateBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
