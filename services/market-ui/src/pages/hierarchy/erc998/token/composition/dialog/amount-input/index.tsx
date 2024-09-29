import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EthInput } from "@ethberry/mui-inputs-mask";

export const AmountInput: FC = () => {
  const decimals = useWatch({ name: "decimals" });

  return <EthInput name="amount" units={decimals} symbol="" />;
};
