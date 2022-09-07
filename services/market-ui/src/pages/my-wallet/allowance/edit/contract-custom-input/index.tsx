import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures } from "@framework/types";

export const ContractCustomInput: FC = () => {
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("contractCustomId", option?.id ?? 0);
    form.setValue("addressCustom", option?.address ?? "0x");
  };

  return (
    <EntityInput
      name="contractCustomId"
      controller="contracts"
      data={{
        contractFeatures: [ContractFeatures.ALLOWANCE],
      }}
      onChange={handleChange}
    />
  );
};
