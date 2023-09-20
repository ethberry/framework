import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";

import { useSettings } from "@gemunion/provider-settings";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract, ITemplate } from "@framework/types";
import { ContractFeatures, TemplateStatus, TokenType } from "@framework/types";

import TemplatePurchaseABI from "../../../../../abis/exchange/purchase/purchase.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";
import { AmountDialog, IAmountDto } from "./dialog";

interface ITemplatePurchaseButtonProps {
  className?: string;
  disabled?: boolean;
  template: ITemplate;
  variant?: ListActionVariant;
}

export const TemplatePurchaseButton: FC<ITemplatePurchaseButtonProps> = props => {
  const { className, disabled, template, variant = ListActionVariant.button } = props;
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false);

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (values: IAmountDto, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, TemplatePurchaseABI, web3Context.provider?.getSigner());

      return contract.purchase(
        {
          externalId: template.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: template.contract!.merchant!.wallet,
          referrer: settings.getReferrer(),
        },
        {
          tokenType: Object.values(TokenType).indexOf(template.contract!.contractType!),
          token: template.contract?.address,
          tokenId: template.contract!.contractType === TokenType.ERC1155 ? template.tokens![0].tokenId : template.id,
          amount: values.amount || 1,
        },
        template.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: BigNumber.from(component.amount).mul(BigNumber.from(values.amount)).toString(),
        })),
        sign.signature,
        {
          value: getEthPrice(template.price).mul(values.amount),
        },
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((values: IAmountDto, web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/marketplace/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer: settings.getReferrer(),
          templateId: template.id,
          amount: values.amount,
        },
      },
      values,
      web3Context,
    ) as Promise<void>;
  });

  const handleBuy = async () => {
    if (template.contract!.contractType === TokenType.ERC1155) {
      setIsAmountDialogOpen(true);
    } else {
      await metaFn({
        amount: 1,
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

  if (template.contract?.contractFeatures.includes(ContractFeatures.EXTERNAL)) {
    return null;
  }

  if (template.templateStatus !== TemplateStatus.ACTIVE) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleBuy}
        message="form.buttons.buy"
        className={className}
        dataTestId="TemplatePurchaseButton"
        disabled={disabled || (template.cap !== "0" && BigInt(template.amount) >= BigInt(template.cap))}
        variant={variant}
      />
      <AmountDialog
        onCancel={handleAmountCancel}
        onConfirm={handleAmountConfirm}
        open={isAmountDialogOpen}
        initialValues={{
          amount: 1,
        }}
      />
    </Fragment>
  );
};
