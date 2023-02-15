import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, TemplateStatus } from "@framework/types";

export const TemplateInput: FC = () => {
  const tokenType = useWatch({ name: "tokenType" });
  const contractIds = useWatch({ name: "contractIds" });

  return (
    <EntityInput
      name="templateIds"
      controller="templates"
      data={{
        contractIds,
        contractType: [tokenType],
        templateStatus: [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN],
        contractFeatures: [ContractFeatures.RANDOM],
      }}
      multiple
    />
  );
};
