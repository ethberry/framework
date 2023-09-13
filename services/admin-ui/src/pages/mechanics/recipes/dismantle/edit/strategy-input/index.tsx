import { FC } from "react";
import { useWatch } from "react-hook-form";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { ContractFeatures, DismantleStrategy } from "@framework/types";

export interface IAddressInputProps {
  name?: string;
}

export const StrategyInput: FC<IAddressInputProps> = props => {
  const { name = "dismantleStrategy" } = props;

  const contractFeatures: Array<ContractFeatures> = useWatch({ name: "price.components[0].contract.contractFeatures" });

  if (contractFeatures.includes(ContractFeatures.RANDOM)) {
    return <SelectInput name={name} options={DismantleStrategy} />;
  }

  return null;
};
