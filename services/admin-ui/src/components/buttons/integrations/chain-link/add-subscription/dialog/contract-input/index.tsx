import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures } from "@framework/types";

export const VrfConsumerInput: FC = () => {
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
        contractFeatures: [ContractFeatures.RANDOM, ContractFeatures.GENES],
      }}
      onChange={handleChange}
      autoselect
    />
  );
};
