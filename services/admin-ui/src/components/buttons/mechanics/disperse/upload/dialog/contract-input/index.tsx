import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus } from "@framework/types";

export interface IContractInputProps {
  name: string;
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { name = "contractId" } = props;
  const tokenType = useWatch({ name: "tokenType" });
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("contractId", option?.id ?? 0);
    form.setValue("address", option?.address ?? "0x");
    form.setValue("decimals", option?.decimals ?? 0);
  };

  return (
    <EntityInput
      name={name}
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractStatus: [ContractStatus.ACTIVE],
      }}
      onChange={handleChange}
      autoselect
    />
  );
};
