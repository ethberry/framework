import { FC } from "react";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

export const TokenTypeInput: FC = () => {
  return <SelectInput name="tokenType" options={TokenType} disabledOptions={[TokenType.NATIVE]} />;
};
