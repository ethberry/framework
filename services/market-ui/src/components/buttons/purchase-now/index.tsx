import { FC } from "react";

import { ListActionVariant } from "@framework/styled";
import { ContractFeatures, ITemplate } from "@framework/types";

import { TemplatePurchaseButton } from "../hierarchy";
import { TemplatePurchaseGenesButton, TemplatePurchaseRandomButton } from "../mechanics";

interface ITemplatePurchaseNowButtonProps {
  className?: string;
  disabled?: boolean;
  template: ITemplate;
  variant?: ListActionVariant;
}

export const PurchaseNowButton: FC<ITemplatePurchaseNowButtonProps> = props => {
  const { template } = props;

  if (template.contract?.contractFeatures.includes(ContractFeatures.RANDOM)) {
    return <TemplatePurchaseRandomButton {...props} />;
  }

  if (template.contract?.contractFeatures.includes(ContractFeatures.GENES)) {
    return <TemplatePurchaseGenesButton {...props} />;
  }

  return <TemplatePurchaseButton {...props} />;
};
