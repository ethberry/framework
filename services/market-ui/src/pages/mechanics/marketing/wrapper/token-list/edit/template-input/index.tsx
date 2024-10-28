import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@ethberry/mui-inputs-entity";
import { ModuleType, TokenType } from "@framework/types";

export interface ITemplateInputProps {
  name?: string;
  autoselect?: boolean;
}

export const TemplateInput: FC<ITemplateInputProps> = props => {
  const { name = "templateId", autoselect } = props;

  const contractId = useWatch({ name: "contractId" });

  return (
    <EntityInput
      name={name}
      autoselect={autoselect}
      controller="templates"
      data={{
        contractIds: contractId ? [contractId] : [],
        contractModule: [ModuleType.WRAPPER],
        contractType: [TokenType.ERC721],
      }}
    />
  );
};
