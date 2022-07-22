import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { ITemplate, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";
import { getEthPrice } from "../../../../utils/money";

interface ITemplatePurchaseButtonProps {
  template: ITemplate;
}

export const TemplatePurchaseButton: FC<ITemplatePurchaseButtonProps> = props => {
  const { template } = props;

  const api = useApi();
  const { provider, account } = useWeb3React();

  const handleBuy = useMetamask(() => {
    return api
      .fetchJson({
        url: "/marketplace/sign",
        method: "POST",
        data: {
          templateId: template.id,
          account,
        },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, provider?.getSigner());
        return contract.purchase(
          utils.arrayify(sign.nonce),
          [
            {
              tokenType: Object.keys(TokenType).indexOf(template.contract!.contractType),
              token: template.contract?.address,
              tokenId: template.id,
              amount: 1,
            },
          ],
          template.price?.components.map(component => ({
            tokenType: Object.keys(TokenType).indexOf(component.tokenType),
            token: component.contract!.address,
            tokenId: component.template!.tokens![0].tokenId,
            amount: component.amount,
          })),
          process.env.ACCOUNT,
          sign.signature,
          {
            value: getEthPrice(template.price),
          },
        ) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBuy} data-testid="TemplatePurchaseButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
