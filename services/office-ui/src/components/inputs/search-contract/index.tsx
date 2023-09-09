import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, ModuleType } from "@framework/types";

interface IContractInputProps {
  prefix: string;
}

export const SearchContractInput: FC<IContractInputProps> = props => {
  const { prefix } = props;

  const form = useFormContext();
  const tokenType = useWatch({ name: `${prefix}.tokenType` });

  useEffect(() => {
    form.setValue(`${prefix}.contractId`, 0);
  }, [tokenType]);

  return (
    <EntityInput
      name={`${prefix}.contractId`}
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        contractModule: [ModuleType.HIERARCHY],
      }}
      autoselect
    />
  );
};
