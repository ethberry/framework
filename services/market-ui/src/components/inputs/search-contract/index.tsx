import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ModuleType } from "@framework/types";

interface IContractInputProps {
  prefix: string;
}

export const SearchContractInput: FC<IContractInputProps> = props => {
  const { prefix } = props;
  const tokenType = useWatch({ name: `${prefix}.tokenType` });

  return (
    <EntityInput
      name={`${prefix}.contractId`}
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractModule: [ModuleType.HIERARCHY],
      }}
      autoselect
    />
  );
};
