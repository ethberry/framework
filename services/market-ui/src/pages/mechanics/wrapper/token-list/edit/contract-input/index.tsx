import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ModuleType } from "@framework/types";

export const ContractInput: FC = () => {
  const tokenType = useWatch({ name: "tokenType" });

  return (
    <EntityInput
      name="contractIds"
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractModule: [ModuleType.WRAPPER],
      }}
    />
  );
};
