import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EthInput } from "@gemunion/mui-inputs-mask";
import { TokenType } from "@framework/types";

export const AmountInput: FC = () => {
  const tokenType = useWatch({ name: "tokenType" });
  const address = useWatch({ name: "address" });
  const decimals = useWatch({ name: "decimals" });

  if (!address) {
    return null;
  }

  switch (tokenType) {
    case TokenType.NATIVE:
    case TokenType.ERC20:
      return <EthInput name="amount" units={decimals} symbol="" />;
    case TokenType.ERC721:
    case TokenType.ERC998:
    case TokenType.ERC1155:
    default:
      return null;
  }
};
