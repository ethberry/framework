import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-collection";
import { useSettings } from "@gemunion/provider-settings";
import { ITemplate, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { getEthPrice } from "../../../../../utils/money";

interface ITemplatePurchaseButtonProps {
  template: ITemplate;
}

export const TemplatePurchaseButton: FC<ITemplatePurchaseButtonProps> = props => {
  const { template } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: Record<string, any>, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
      return contract.purchase(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: template.id,
          expiresAt: sign.expiresAt,
          referrer: settings.getReferrer(),
        },
        {
          tokenType: Object.keys(TokenType).indexOf(template.contract!.contractType),
          token: template.contract?.address,
          tokenId: template.contract!.contractType === TokenType.ERC1155 ? template.tokens![0].tokenId : template.id,
          amount: 1,
        },
        template.price?.components.map(component => ({
          tokenType: Object.keys(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          // pass templateId instead of tokenId = 0
          tokenId:
            component.template!.tokens![0].tokenId === "0"
              ? component.template!.tokens![0].templateId
              : component.template!.tokens![0].tokenId,
          amount: component.amount,
        })),
        process.env.ACCOUNT,
        sign.signature,
        {
          value: getEthPrice(template.price),
        },
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/marketplace/sign",
        method: "POST",
        data: {
          templateId: template.id,
          account,
          referrer: settings.getReferrer(),
        },
      },
      web3Context,
    );
  });

  const handleBuy = async () => {
    await metaFn();
  };

  return (
    <Button onClick={handleBuy} data-testid="TemplatePurchaseButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
