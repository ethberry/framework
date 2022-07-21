import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";

import { ITemplate, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";
import { getEthPrice } from "../../../../utils/money";

interface ITemplatePurchaseButtonProps {
  template: ITemplate;
}

export const TemplatePurchaseButton: FC<ITemplatePurchaseButtonProps> = props => {
  const { template } = props;

  const web3ContextGlobal = useWeb3React();
  const { provider, account } = web3ContextGlobal;
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const metaFnWithSignature = useServerSignature((props: any) => {
    const { sign, web3Context } = props;

    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, (web3Context?.provider || provider)?.getSigner());

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

  const metaFnWithWallet = useMetamask((props: any) => {
    const { web3Context } = props;

    const thenHandler = (result: any) => {
      enqueueSnackbar(formatMessage({ id: "snackbar.success" }), { variant: "success" });
      return result;
    };

    const catchHandler = (e: any) => {
      if (e.status === 400) {
        const errors = e.getLocalizedValidationErrors ? e.getLocalizedValidationErrors() : [];

        console.log("errors", errors);
        enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
      } else if (e.status) {
        enqueueSnackbar(formatMessage({ id: `snackbar.${e.message as string}` }), { variant: "error" });
      } else {
        console.error(e);
        enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
      }
    };

    return metaFnWithSignature({
      url: "/marketplace/sign",
      method: "POST",
      data: {
        templateId: template.id,
        account: account || web3Context?.account,
      },
      web3Context: web3Context || web3ContextGlobal,
    }, thenHandler, catchHandler).then(thenHandler).catch(catchHandler);
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
