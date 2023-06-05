import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ModuleType, TemplateStatus, TokenType } from "@framework/types";

export interface ITemplateInputProps {
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
}

export const TemplateInput: FC<ITemplateInputProps> = props => {
  const { contractType = [], contractModule = [] } = props;

  const contractIds = useWatch({ name: "contractIds" });

  return (
    <EntityInput
      name="templateIds"
      controller="templates"
      data={{
        contractIds,
        contractType,
        contractModule,
        templateStatus: [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN],
      }}
      multiple
    />
  );
};
