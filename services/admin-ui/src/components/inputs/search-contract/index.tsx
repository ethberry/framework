import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, ModuleType } from "@framework/types";

interface IContractInputProps {
  prefix: string;
}

export const SearchContractInput: FC<IContractInputProps> = props => {
  const { prefix } = props;
  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const emptyReward = useWatch({ name: "emptyReward" });

  return (
    <EntityInput
      name={`${prefix}.contractId`}
      controller="contracts"
      disabled={prefix === "reward" && emptyReward}
      data={{
        contractType: [tokenType],
        contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        contractModule: [ModuleType.HIERARCHY],
      }}
      autoselect
    />
  );
};
