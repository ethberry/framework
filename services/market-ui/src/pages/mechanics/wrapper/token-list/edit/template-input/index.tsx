import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ModuleType, TokenType } from "@framework/types";

export interface ITemplateInputProps {
  name?: string;
}

export const TemplateInput: FC<ITemplateInputProps> = (props) => {
  const { name = "templateId" } = props;

  const contractId = useWatch({ name: "contractId" });

  return (
    <EntityInput
      name={name}
      controller="templates"
      data={{
        contractIds: contractId ? [contractId] : [],
        contractModule: [ModuleType.WRAPPER],
        contractType: [TokenType.ERC721],
      }}
    />
  );
};
