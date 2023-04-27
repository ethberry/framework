import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils, BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { ITemplate, TokenType } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";

import TemplatePurchaseABI from "../../../../../abis/components/buttons/hierarchy/template/purchase/purchase.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";
import { AmountDialog, IAmountDto } from "./dialog";

interface ITemplatePurchaseButtonProps {
  template: ITemplate;
}

export const TemplatePurchaseButton: FC<ITemplatePurchaseButtonProps> = props => {
  const { template } = props;
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false);

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (values: IAmountDto, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, TemplatePurchaseABI, web3Context.provider?.getSigner());
      return contract.purchase(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: template.id,
          expiresAt: sign.expiresAt,
          referrer: settings.getReferrer(),
        },
        {
          tokenType: Object.values(TokenType).indexOf(template.contract!.contractType),
          token: template.contract?.address,
          tokenId: template.contract!.contractType === TokenType.ERC1155 ? template.tokens![0].tokenId : template.id,
          amount: values.amount || 1,
        },
        template.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          // pass templateId instead of tokenId = 0
          // tokenId:
          //   component.template!.tokens![0].tokenId === "0"
          //     ? component.template!.tokens![0].templateId
          //     : component.template!.tokens![0].tokenId,
          tokenId: component.template!.tokens![0].tokenId,
          // amount: component.amount,
          amount: BigNumber.from(component.amount).mul(BigNumber.from(values.amount)).toString(),
        })),
        sign.signature,
        {
          value: getEthPrice(template.price),
        },
      ) as Promise<void>;
    },
    { error: false },
  );

  const metaFn = useMetamask((dto: IAmountDto, web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/marketplace/sign",
        method: "POST",
        data: {
          account,
          referrer: settings.getReferrer(),
          templateId: template.id,
          amount: dto.amount,
        },
      },
      dto,
      web3Context,
    );
  });

  const handleBuy = async () => {
    if (template.contract!.contractType === TokenType.ERC1155) {
      setIsAmountDialogOpen(true);
    } else {
      await metaFn({
        amount: "1",
      });
    }
  };

  const handleAmountConfirm = async (dto: IAmountDto): Promise<void> => {
    await metaFn(dto).then(() => {
      setIsAmountDialogOpen(false);
    });
  };

  const handleAmountCancel = (): void => {
    setIsAmountDialogOpen(false);
  };

  return (
    <Fragment>
      <Button onClick={handleBuy} data-testid="TemplatePurchaseButton">
        <FormattedMessage id="form.buttons.buy" />
      </Button>
      <AmountDialog
        onCancel={handleAmountCancel}
        onConfirm={handleAmountConfirm}
        open={isAmountDialogOpen}
        initialValues={{
          amount: "1",
        }}
      />
    </Fragment>
  );
};
