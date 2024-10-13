import { FC } from "react";

import { ListActionVariant } from "@framework/styled";
import { ContractFeatures, ITemplate } from "@framework/types";

import { TemplatePurchaseButton } from "../purchase";
import { TemplatePurchaseRandomButton } from "../purchase-random";
import { TemplatePurchaseGenesButton } from "../purchase-genes";

interface ITemplatePurchaseNowButtonProps {
  className?: string;
  disabled?: boolean;
  template: ITemplate;
  variant?: ListActionVariant;
}

export const TemplatePurchaseNowButton: FC<ITemplatePurchaseNowButtonProps> = props => {
  const { template } = props;

  if (template.contract?.contractFeatures.includes(ContractFeatures.RANDOM)) {
    return <TemplatePurchaseRandomButton {...props} />;
  }
  if (template.contract?.contractFeatures.includes(ContractFeatures.GENES)) {
    return <TemplatePurchaseGenesButton {...props} />;
  }

  return <TemplatePurchaseButton {...props} />;
};
