import { FC } from "react";
import { useWatch } from "react-hook-form";

import { CurrencyInput } from "@ethberry/mui-inputs-mask";
import { DismantleStrategy } from "@framework/types";

export interface IAddressInputProps {
  name?: string;
}

export const GrowthRateInput: FC<IAddressInputProps> = props => {
  const { name = "growthRate" } = props;

  const dismantleStrategy = useWatch({ name: "dismantleStrategy" });

  if (dismantleStrategy === DismantleStrategy.EXPONENTIAL) {
    return <CurrencyInput name={name} symbol="" precision={2} />;
  }

  return null;
};
