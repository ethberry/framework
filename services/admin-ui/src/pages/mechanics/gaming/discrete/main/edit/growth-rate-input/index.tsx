import { FC } from "react";
import { useWatch } from "react-hook-form";

import { CurrencyInput } from "@ethberry/mui-inputs-mask";
import { DiscreteStrategy } from "@framework/types";

export interface IAddressInputProps {
  name?: string;
}

export const GrowthRateInput: FC<IAddressInputProps> = props => {
  const { name = "growthRate" } = props;

  const discreteStrategy = useWatch({ name: "discreteStrategy" });

  if (discreteStrategy === DiscreteStrategy.EXPONENTIAL) {
    return <CurrencyInput name={name} symbol="" precision={2} />;
  }

  return null;
};
