import { useEffect } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";

export const MysteryboxInput = () => {
  const contractId = useWatch({ name: "contractId" });

  useEffect(() => {}, [contractId]);

  return (
    <EntityInput
      name="mysterybox"
      controller="mystery/boxes"
      data={{ contractIds: [contractId] }}
      autoselect
      disableClear
    />
  );
};
