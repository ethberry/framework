import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, ModuleType, TokenType } from "@framework/types";

export interface IContractInputProps {
  name?: string;
  related?: string;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractModule?: Array<ModuleType>;
  };
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { name = "contractId" } = props;

  const form = useFormContext<any>();
  const tokenType = useWatch({ name: "tokenType" });

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("contractId", option?.id ?? 0);
    form.setValue("contract.address", option?.address ?? "0x");
  };

  return (
    <EntityInput
      name={name}
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractModule: [ModuleType.WRAPPER],
      }}
      onChange={handleChange}
    />
  );
};
