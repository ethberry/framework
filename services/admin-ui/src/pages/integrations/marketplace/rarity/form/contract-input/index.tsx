import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, ContractStatus } from "@framework/types";

export const ContractInput: FC = () => {
  const tokenType = useWatch({ name: "tokenType" });

  return (
    <EntityInput
      multiple
      name="contractIds"
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractStatus: [ContractStatus.ACTIVE],
        contractFeatures: [ContractFeatures.UPGRADEABLE],
      }}
    />
  );
};
