import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, ModuleType } from "@framework/types";

export const ContractInput: FC = () => {
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("contractId", option?.id ?? 0);
    form.setValue("address", option?.address ?? "0x");
  };

  return (
    <EntityInput
      name="contractId"
      controller="contracts"
      data={{
        contractModule: [ModuleType.RAFFLE],
        contractFeatures: [ContractFeatures.RANDOM],
      }}
      onChange={handleChange}
      autoselect
    />
  );
};
