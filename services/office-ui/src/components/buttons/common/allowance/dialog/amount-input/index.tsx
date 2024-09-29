import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EthInput } from "@ethberry/mui-inputs-mask";

export const AmountInput: FC = () => {
  const decimals = useWatch({ name: "contract.decimals" });

  return <EthInput name="amount" units={decimals} symbol="" />;
};
