import { ChangeEvent, FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@ethberry/mui-inputs-entity";

export const VestingBoxInput: FC = () => {
  const contractId = useWatch({ name: "contractId" });
  const vestingId = useWatch({ name: "vestingId" });
  const form = useFormContext();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue("vestingBox", option, { shouldDirty: true });
    form.setValue("vestingId", option?.id ?? 0, { shouldDirty: true });
  };

  useEffect(() => {
    if (!vestingId) {
      form.setValue("vestingBox", null);
    }
  }, [vestingId]);

  return (
    <EntityInput
      required
      name="vestingId"
      controller="vesting/boxes"
      onChange={handleChange}
      data={{ contractIds: [contractId] }}
      autoselect
      disableClear
    />
  );
};
