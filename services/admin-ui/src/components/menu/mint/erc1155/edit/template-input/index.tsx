import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";

export interface ITemplateInputProps {
  name: string;
}

export const TemplateInput: FC<ITemplateInputProps> = props => {
  const { name } = props;

  const contractId = useWatch({ name: "contractId" });

  return (
    <EntityInput
      name={name}
      controller="templates"
      data={{
        contractIds: [contractId],
        // templateStatus: [TemplateStatus.ACTIVE],
      }}
    />
  );
};
