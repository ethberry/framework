import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateStatus, TokenType } from "@framework/types";

export const TemplateInput: FC = () => {
  const contractIds = useWatch({ name: "contractIds" });

  return (
    <EntityInput
      name="templateIds"
      controller="templates"
      data={{
        contractIds,
        contractType: [TokenType.ERC721],
        templateStatus: [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN],
      }}
      multiple
    />
  );
};
