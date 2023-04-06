import { ChangeEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";

export const MysteryboxInput = () => {
  const contractId = useWatch({ name: "contractId" });
  const form = useFormContext();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("mysterybox", option);
    form.setValue("mysteryId", option?.id ?? 0);
  };

  return (
    <EntityInput
      name="mysteryId"
      controller="mystery/boxes"
      onChange={handleChange}
      data={{ contractIds: [contractId] }}
      autoselect
      disableClear
    />
  );
};
