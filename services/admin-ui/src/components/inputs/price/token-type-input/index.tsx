import { FC } from "react";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
  disabledOptions?: Array<TokenType>;
}

export const TokenTypeInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "tokenType", disabledOptions = [] } = props;

  return <SelectInput name={`${prefix}.${name}`} options={TokenType} disabledOptions={disabledOptions} />;
};
