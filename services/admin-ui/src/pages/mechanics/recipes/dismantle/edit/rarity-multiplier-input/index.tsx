import { FC } from "react";
import { useWatch } from "react-hook-form";
import { InputAdornment } from "@mui/material";

import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { ContractFeatures } from "@framework/types";

export interface IAddressInputProps {
  name?: string;
}

export const RarityMultiplierInput: FC<IAddressInputProps> = props => {
  const { name = "rarityMultiplier" } = props;

  const contractFeatures: Array<ContractFeatures> = useWatch({ name: "price.components[0].contract.contractFeatures" });

  if (contractFeatures.includes(ContractFeatures.RANDOM)) {
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
