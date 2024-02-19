import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";

export interface ITemplateInputProps {
  prefix: string;
}

export const TemplateInput: FC<ITemplateInputProps> = props => {
  const { prefix } = props;

  const contractId = useWatch({ name: `${prefix}.contractId` });

  if (!contractId) {
    return null;
  }

  return (
    <EntityInput
      name={`${prefix}.templateId`}
      controller="templates"
      data={{
        contractIds: contractId ? [contractId] : [],
      }}
    />
  );
};
