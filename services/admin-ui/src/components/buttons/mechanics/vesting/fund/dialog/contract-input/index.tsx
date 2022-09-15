import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, ModuleType } from "@framework/types";

export const ContractInput: FC = () => {
  const tokenType = useWatch({ name: "tokenType" });
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("contractId", option?.id ?? 0);
    form.setValue("contract.address", option?.address ?? "0x");
    form.setValue("contract.decimals", option?.decimals ?? 0);
  };

  return (
    <EntityInput
      name="contractId"
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        contractModule: [ModuleType.HIERARCHY],
      }}
      onChange={handleChange}
    />
  );
};
