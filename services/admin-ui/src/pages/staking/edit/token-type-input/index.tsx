import { FC } from "react";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
}

export const TokenTypeInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "tokenType" } = props;

  return <SelectInput name={`${prefix}.${name}`} options={TokenType} disabledOptions={[TokenType.ERC998]} />;
};
