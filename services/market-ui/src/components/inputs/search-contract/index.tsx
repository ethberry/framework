import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@ethberry/mui-inputs-entity";
import { ModuleType } from "@framework/types";

interface IContractInputProps {
  prefix: string;
}

export const SearchContractInput: FC<IContractInputProps> = props => {
  const { prefix } = props;

  const form = useFormContext();
  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const emptyReward = useWatch({ name: "emptyReward" });

  const disabled = prefix === "reward" && emptyReward;

  useEffect(() => {
    form.setValue(`${prefix}.contractId`, 0);
  }, [tokenType]);

  return (
    <EntityInput
      name={`${prefix}.contractId`}
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractModule: [ModuleType.HIERARCHY],
      }}
      disabled={disabled}
      disableClear
      autoselect
    />
  );
};
