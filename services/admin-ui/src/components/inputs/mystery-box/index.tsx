import { ChangeEvent, FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";

export const MysteryboxInput: FC = () => {
  const contractId = useWatch({ name: "contractId" });
  const mysteryId = useWatch({ name: "mysteryId" });
  const form = useFormContext();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue("mysterybox", option, { shouldDirty: true });
    form.setValue("mysteryId", option?.id ?? 0, { shouldDirty: true });
  };

  useEffect(() => {
    if (!mysteryId) {
      form.setValue("mysterybox", null);
    }
  }, [mysteryId]);

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
