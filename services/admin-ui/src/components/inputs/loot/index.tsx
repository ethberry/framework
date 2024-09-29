import { ChangeEvent, FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@ethberry/mui-inputs-entity";

export const LootBoxInput: FC = () => {
  const contractId = useWatch({ name: "contractId" });
  const lootId = useWatch({ name: "lootId" });
  const form = useFormContext();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue("lootBox", option, { shouldDirty: true });
    form.setValue("lootId", option?.id ?? 0, { shouldDirty: true });
  };

  useEffect(() => {
    if (!lootId) {
      form.setValue("lootBox", null);
    }
  }, [lootId]);

  return (
    <EntityInput
      required
      name="lootId"
      controller="loot/boxes"
      onChange={handleChange}
      data={{ contractIds: [contractId] }}
      autoselect
      disableClear
    />
  );
};
