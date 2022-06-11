import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EthInput } from "@gemunion/mui-inputs-mask";
import { TokenType } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
}

export const AmountInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "amount" } = props;

  const tokenType = useWatch({ name: `${prefix}.tokenType` });

  switch (tokenType) {
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
