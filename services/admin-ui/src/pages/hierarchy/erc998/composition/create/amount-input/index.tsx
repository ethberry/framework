import { FC } from "react";
import { useWatch } from "react-hook-form";

import { NumberInput } from "@ethberry/mui-inputs-core";
import { TokenType } from "@framework/types";

export interface IErc998CompositionAmountInputProps {
  name: string;
}

export const Erc998CompositionAmountInput: FC<IErc998CompositionAmountInputProps> = props => {
  const { name = "amount" } = props;

  const values = useWatch();

  return <NumberInput name={name} disabled={values.child.contractType === TokenType.ERC20} />;
};
