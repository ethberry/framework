import { FC } from "react";
import { Button } from "@mui/material";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";

import { ITemplate, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { IServerSignature } from "@gemunion/types-collection";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";
import { getEthPrice } from "../../../../utils/money";

interface ITemplatePurchaseButtonProps {
  template: ITemplate;
}

export const TemplatePurchaseButton: FC<ITemplatePurchaseButtonProps> = props => {
  const { template } = props;

  const metaFnWithSignature = useServerSignature((_values: any, web3Context: Web3ContextType, sign: IServerSignature) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());

    return contract.execute(
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

  const metaFnWithWallet = useMetamask((_values: any, web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSignature({
      url: "/marketplace/sign",
      method: "POST",
      data: {
        templateId: template.id,
        account,
      },
    }, web3Context);
  });

  const handleBuy = async () => {
    await metaFnWithWallet();
  };

  return (
    <Button onClick={handleBuy} data-testid="TemplatePurchaseButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
