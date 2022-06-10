import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EthInput } from "@gemunion/mui-inputs-mask";
import { TokenType } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
  related?: string;
}

export const AmountInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "amount", related = "tokenType" } = props;

  const value = useWatch({ name: `${prefix}.${related}` });

  switch (value) {
    case TokenType.NATIVE:
    case TokenType.ERC20:
    case TokenType.ERC1155:
      return <EthInput name={`${prefix}.${name}`} />;
    case TokenType.ERC721:
    case TokenType.ERC998:
    default:
      return null;
  }
};
