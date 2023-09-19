import { FC } from "react";
import { useWatch } from "react-hook-form";
import { InputAdornment } from "@mui/material";

import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { DismantleStrategy } from "@framework/types";

export interface IAddressInputProps {
  name?: string;
  field?: string;
}

export const RarityMultiplierInput: FC<IAddressInputProps> = props => {
  const { name = "rarityMultiplier", field = "dismantleStrategy" } = props;

  const dismantleStrategy: DismantleStrategy = useWatch({ name: field });

  if (dismantleStrategy === DismantleStrategy.EXPONENTIAL) {
    return (
      <CurrencyInput
        name={name}
        symbol=""
        precision={2}
        fillByZeros={true}
        InputProps={{
          endAdornment: <InputAdornment position="start">%</InputAdornment>,
        }}
      />
    );
  }

  return null;
};
