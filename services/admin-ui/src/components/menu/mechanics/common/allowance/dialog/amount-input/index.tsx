import { FC } from "react";
import { get, useWatch } from "react-hook-form";

import { EthInput } from "@gemunion/mui-inputs-mask";

export const AmountInput: FC = () => {
  const decimals = get(useWatch(), "contract.decimals");

  return <EthInput name="amount" units={decimals} symbol="" />;
};
