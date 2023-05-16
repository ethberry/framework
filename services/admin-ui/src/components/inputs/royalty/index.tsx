import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { Erc1155ContractTemplates, Erc721ContractTemplates } from "@framework/types";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";

export interface IRoyaltyInputProps {
  name?: string;
}

export const RoyaltyInput: FC<IRoyaltyInputProps> = props => {
  const { name = "royalty" } = props;

  const form = useFormContext();
  const contractTemplate = useWatch({ name: "contractTemplate" });

  useEffect(() => {
    if (
      contractTemplate === Erc721ContractTemplates.SOULBOUND ||
      contractTemplate === Erc721ContractTemplates.SOULBOUND_VOTES ||
      contractTemplate === Erc1155ContractTemplates.SOULBOUND
    ) {
      form.setValue(name, 0);
    }
  }, [contractTemplate]);

  switch (contractTemplate) {
    case Erc721ContractTemplates.SOULBOUND:
    case Erc721ContractTemplates.SOULBOUND_VOTES:
    case Erc1155ContractTemplates.SOULBOUND:
      return null;
    default:
      return <CurrencyInput name={name} symbol="%" />;
  }
};
