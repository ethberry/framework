import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures } from "@framework/types";

export interface IContractInputProps {
  prefix: string;
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { prefix } = props;

  const tokenType = useWatch({ name: "tokenType" });

  return (
    <EntityInput
      name={`${prefix}.contractId`}
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractFeatures: [ContractFeatures.GENES],
      }}
    />
  );
};
