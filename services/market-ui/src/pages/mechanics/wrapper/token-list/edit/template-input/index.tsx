import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ModuleType, TokenType } from "@framework/types";

export const TemplateInput: FC = () => {
  const contractId = useWatch({ name: "contractId" });

  return (
    <EntityInput
      name="templateId"
      controller="templates"
      data={{
        contractIds: contractId ? [contractId] : [],
        contractModule: [ModuleType.WRAPPER],
        contractType: [TokenType.ERC721],
      }}
    />
  );
};
