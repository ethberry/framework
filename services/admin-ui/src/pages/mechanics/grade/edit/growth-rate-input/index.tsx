import { FC } from "react";
import { useWatch } from "react-hook-form";

import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { GradeStrategy } from "@framework/types";

export interface IAddressInputProps {
  name?: string;
}

export const GrowthRateInput: FC<IAddressInputProps> = props => {
  const { name = "growthRate" } = props;

  const gradeStrategy = useWatch({ name: "gradeStrategy" });

  if (gradeStrategy === GradeStrategy.EXPONENTIAL) {
    return <CurrencyInput name={name} symbol="" precision={0} />;
  }

  return null;
};
